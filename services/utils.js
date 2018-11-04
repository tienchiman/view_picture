const os = require('os');

module.exports = {
    getIp(){
        let localhost = '';
        try {
            const network = os.networkInterfaces()
            localhost = network[Object.keys(network)[0]][1].address
        } catch (e) {
            localhost = '127.0.0.1'
        }
        return localhost;
    }
}
