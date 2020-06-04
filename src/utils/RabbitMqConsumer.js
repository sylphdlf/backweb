let amqp = require('amqplib');

class MqConsumer {
    constructor() {
        this.hosts = ['amqp://127.0.0.1'];
        this.index = 0;
        this.length = this.hosts.length;
        this.open = amqp.connect({
            hostname:'127.0.0.1',
            port:5672
            // username:"guest",
            // password:"guest"
        });
    }
    receiveQueueMsg(queueName, receiveCallBack, errCallBack) {
        let self = this;
        self.open.then(function (conn) {
            return conn.createChannel();
        }).then(function (channel) {
            return channel.assertQueue(queueName).then(function (ok) {
                return channel.consume(queueName, function (msg) {
                    if (msg !== null) {
                        let data = msg.content.toString();
                        channel.ack(msg);
                        receiveCallBack && receiveCallBack(data);
                    }
                }).finally(function () {
                    setTimeout(() => {
                        if (channel) {
                            channel.close();
                        }
                    }, 500)
                });
            })
        }).catch(function () {
            let num = self.index++;
            if (num <= self.length - 1) {
                self.open = amqp.connect(self.hosts[num]);
            } else {
                self.index = 0;
                self.open = amqp.connect(self.hosts[0]);
            }
        });
    }
}

let mq = new MqConsumer();
setInterval(()=>{
    mq.receiveQueueMsg('mq_to_nodejs',(msg) => {
        console.log(msg)
    })
},500);