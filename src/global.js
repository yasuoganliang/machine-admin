const host = process.env.SERVER_URL || 'http://192.168.1.68:9528';
// const host = 'http://zmblog.wang/employeeManager/';

// const socket_host = 'ws://zmblog.wang/employeeManager/';
const socket_host = 'ws://192.168.1.68:9528';
export default {
    host,    //地址
    socket_host
}