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
        win: {
            //设置应用图标
            icon: './public/timg.jpg'
        },
        mac: {
            //设置应用图标
            icon: './public/favicon.ico'
        },
        productName: '一体机管理系统'
    }

}