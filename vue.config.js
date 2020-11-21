const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: './',
    devServer: {
        //配置 npm run serve 运行选项
        host: '0.0.0.0',
        port: 9529
    },
    chainWebpack: config => {
        //路径别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('src', resolve('src'))
            .set('components', resolve('src/components'));
    },
    //
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.example.app",
                "productName":"machine",//项目名，也是生成的安装文件名，即aDemo.exe
                "copyright":"Copyright © 2020",//版权信息
                "directories":{
                    "output":"./dist"//输出文件路径
                },
                "win":{//win相关配置
                    "icon":"./public/haha.ico",//图标，当前图标在根目录下，注意这里有两个坑
                    "target": [
                        {
                            "target": "nsis",//利用nsis制作安装程序
                            "arch": [
                                "x64",//64位
                                "ia32"//32位
                            ]
                        }
                    ]
                },
                "nsis": {
                    "oneClick": false, // 是否一键安装
                    "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    "allowToChangeInstallationDirectory": true, // 允许修改安装目录
                    "installerIcon": "./public/haha.ico",// 安装图标
                    "uninstallerIcon": "./public/haha.ico",//卸载图标
                    "installerHeaderIcon": "./public/haha.ico", // 安装时头部图标
                    "createDesktopShortcut": true, // 创建桌面图标
                    "createStartMenuShortcut": true,// 创建开始菜单图标
                    "shortcutName": "haha", // 图标名称
                },
            }
        },

        // win: {
        //     //设置应用图标
        //     icon: './public/timg.jpg'
        // },
        // mac: {
        //     //设置应用图标
        //     icon: './public/timg.jpg'
        // },
        productName: '一体机管理系统'
    }

}