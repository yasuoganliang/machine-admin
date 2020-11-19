//chunkedUpload.js
import SparkMD5 from 'spark-md5'
import axios from 'axios'
import store from '@/store'
// 如果上传错误，获取报错信息
function getError(action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }
  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}
// 上传成功完成合并之后，获取服务器返回的信息
function getBody(xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }
  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

// 分片上传的自定义请求，以下请求会覆盖element的默认上传行为
export default function upload(option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }
  const spark = new SparkMD5.ArrayBuffer()// md5的ArrayBuffer加密类
  const fileReader = new FileReader()// 文件读取类
  const action = option.action // 文件上传上传路径
  const chunkSize = 1024 * 1024 * 30 // 单个分片大小
  let md5 = ''// 文件的唯一标识
  const optionFile = option.file // 需要分片的文件
  let fileChunkedList = [] // 文件分片完成之后的数组
  const percentage = [] // 文件上传进度的数组，单项就是一个分片的进度

  // 文件开始分片，push到fileChunkedList数组中， 并用第一个分片去计算文件的md5
  for (let i = 0; i < optionFile.size; i = i + chunkSize) {
    const tmp = optionFile.slice(i, Math.min((i + chunkSize), optionFile.size))
    if (i === 0) {
      fileReader.readAsArrayBuffer(tmp)
    }
    fileChunkedList.push(tmp)
  }

  // 在文件读取完毕之后，开始计算文件md5，作为文件唯一标识
  fileReader.onload = async(e) => {
    spark.append(e.target.result)
    md5 = spark.end() + new Date().getTime()
    console.log('文件md5为--------', md5)
    // 将fileChunkedList转成FormData对象，并加入上传时需要的数据
    fileChunkedList = fileChunkedList.map((item, index) => {
      const formData = new FormData()
      if (option.data) {
        // 额外加入外面传入的data数据
        Object.keys(option.data).forEach(key => {
          formData.append(key, option.data[key])
        })
        // 这些字段看后端需要哪些，就传哪些，也可以自己追加额外参数
        formData.append(option.filename, item, option.file.name)// 文件
        formData.append('chunkNumber', index + 1)// 当前文件块
        formData.append('chunkSize', chunkSize)// 单个分块大小
        formData.append('currentChunkSize', item.size)// 当前分块大小
        formData.append('totalSize', optionFile.size)// 文件总大小
        formData.append('identifier', md5)// 文件标识
        formData.append('filename', option.file.name)// 文件名
        formData.append('totalChunks', fileChunkedList.length)// 总块数
      }
      return { formData: formData, index: index }
    })

    // 更新上传进度条百分比的方法
    const updataPercentage = (e) => {
      let loaded = 0// 当前已经上传文件的总大小
      percentage.forEach(item => {
        loaded += item
      })
      e.percent = loaded / optionFile.size * 100
      option.onProgress(e)
    }

    // 创建队列上传任务，limit是上传并发数
    function sendRequest(chunks, limit = 3) {
      return new Promise((resolve, reject) => {
        const len = chunks.length
        let counter = 0
        let isStop = false
        const start = async() => {
          if (isStop) {
            return
          }
          const item = chunks.shift()
          console.log()
          if (item) {
            const xhr = new XMLHttpRequest()
            const index = item.index
            // 分片上传失败回调
            xhr.onerror = function error(e) {
              isStop = true
              reject(e)
            }
            // 分片上传成功回调
            xhr.onload = function onload() {
              if (xhr.status < 200 || xhr.status >= 300) {
                isStop = true
                reject(getError(action, option, xhr))
              }
              if (counter === len - 1) {
                // 最后一个上传完成
                resolve()
              } else {
                counter++
                start()
              }
            }
            // 分片上传中回调
            if (xhr.upload) {
              xhr.upload.onprogress = function progress(e) {
                if (e.total > 0) {
                  e.percent = e.loaded / e.total * 100
                }
                percentage[index] = e.loaded
                console.log(index)
                updataPercentage(e)
              }
            }
            xhr.open('post', action, true)
            if (option.withCredentials && 'withCredentials' in xhr) {
              xhr.withCredentials = true
            }
            const headers = option.headers || {}
            for (const item in headers) {
              if (headers.hasOwnProperty(item) && headers[item] !== null) {
                xhr.setRequestHeader(item, headers[item])
              }
            }
            // 文件开始上传
            xhr.send(item.formData)
            //这里是把所有分片上传的xhr存到全局中，如果用户手动取消上传，或者上传出现错误，则要调用xhr.abort()把store中所有xhr的停止，不然文件还会继续上传
            store.commit('SET_CHUNKEDUPLOADXHR', xhr)
          }
        }
        while (limit > 0) {
          setTimeout(() => {
            start()
          }, Math.random() * 1000)
          limit -= 1
        }
      })
    }

    try {
      // 调用上传队列方法 等待所有文件上传完成
      await sendRequest(fileChunkedList, 3)
      // 这里的参数根据自己实际情况写
      const data = {
        identifier: md5,
        filename: option.file.name,
        totalSize: optionFile.size
      }
      // 给后端发送文件合并请求
      const fileInfo = await axios({
        method: 'post',
        url: '/api/oss/oss/mergeChunkFile',
        data: data
      })
      // 这个8200是我们oss存储成功的code，根据自己实际情况可以变
      if (fileInfo.data.code === 8200) {
        const success = getBody(fileInfo.request)
        option.onSuccess(success)
        return
      }
    } catch (error) {
      option.onError(error)
    }
  }
}