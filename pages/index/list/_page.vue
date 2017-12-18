<template>
    <article-list :articles="articles"></article-list>
</template>
<script>
import articleList from "~/components/index/article_list.vue";
export default {
  components: {
    articleList
  },
  data() {
    return {
      articles: {
        code: 200,
        success: true,
        result: {
          count: 24,
          totalPage: 5,
          article_lists: [
            {
              id: 47,
              title: "gitlab/github 多账户下设置 ssh keys",
              reprint_url: "",
              content:
                '公司之前版本控制工具一直用的是SVN,自己的代码放在github,结果新项目需要用到公司搭建的gitlab,生成的sshkey覆盖了原本我github的秘钥,之前还没发现,一次在github查看push日志突然发现提交人不对了:\n![](/Uploads/Picture/2017-11-08/1510110258.png)\n后来在网上找到解决办法:\n1. 进行公司账号的设置:\n     `ssh-keygen -t rsa -C "注册的gitlab邮箱"`,就用默认密钥名称,密码的话直接跳过吧,然后在`~/.ssh`能找到`id_rsa`和`id_rsa.pub`\n\t ![](/Uploads/Picture/2017-11-08/1510110772.png)\n\t 把id_rsa.pub的内容添加到到gitlab账户的的SSH Keys中即可\n\n2. 生成github秘钥:\n\t终端执行命令：`ssh-keygen -t rsa -C "注册的github邮箱"`，这次一定要注意，对生成定的秘钥进行重命名,我这里命名的是`id_rsa_github`,同样不设置密码。可以看到生成的公私秘钥已经分别被重命名为`id_rsa_github.pub`和`id_rsa_github`。\n\t![](/Uploads/Picture/2017-11-08/1510110783.png)\n\t将id_rsa_github.pub的内容拷到github的SSH Keys里\n\t\n3. 配置config:\n\t终端运行:`touch config`,输入:\n```shell\nHost gitlab\nHostName 192.168.13.21\nIdentityFile ~/.ssh/id_rsa\nHost github\nHostName github.com\nIdentityFile ~/.ssh/id_rsa_github\n```\n其中Host对应的名称是一个别名，命名可以随意，用来进行远程连接，当然使用真实的主机名称也是可以的。HostName和IdentityFile就是各自主机名称以及对应的秘钥文件了~\n这样配置之后，两份秘钥也就对应到各自相应的仓库上了。通过设置别名，也就可以设置任意多的账户了~\n\n4. 最后利用别名检测下配置是否成功:\n    4.1 检测github连接:\n\t![](/Uploads/Picture/2017-11-08/1510111053.png)\n\t4.2 检测gitlab连接:\n\t![](/Uploads/Picture/2017-11-08/1510111127.png)\n\t\n不报错的话，就说明设置成功了！\n\n参考地址:\n- [https://segmentfault.com/a/1190000002994742](https://segmentfault.com/a/1190000002994742)',
              is_html: 0,
              uname: "admin",
              create_time: "2017-11-08 11:20:23",
              release_time: "11月08,2017"
            },
            {
              id: 46,
              title: "websocket配合小程序实现扫码登录",
              reprint_url: "",
              content:
                '后台一直都是密码登录,简直枯燥的没朋友,看见小伙伴的博客设置的是扫描二维码登录,然后请教了一番加上自己的理解,实现了小程序配合扫码登录后台\n\n首先是要理解扫码登录的逻辑,在我看来扫码的小程序就是superadmin,扫码就能实现后台的token生成,保存到redis,发放给前端页面,所以小程序的权限设置是很重要的,这里单独新增一个表:`tp_wx`,存放微信账号的唯一标识,可读可写:\n![](/Uploads/Picture/2017-11-04/1509810312.png)\n\n`OPEN_ID`字段就是小程序里 [wx.login](https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject "wx.login") 方法的返回值,用户唯一标识,\n数据库里不存在该`OPEN_ID`的话当然是没有权限的:\n![](/Uploads/Picture/2017-11-04/1509810495.png)\n\n下面是简单的思路:\n1. `websocket`连接服务端之后保存一个自定义的标识,对应相应客户端,下面把这个标识称之为`key`\n\n2.  再把这个`key`通过`qrcode`生成二维码显示到页面上等待小程序扫码读取\n\n3. 小程序扫码后,获取到这个`key`并发送给服务端\n\n4. 服务端再通过小程序发送的`key`找到对应的客户端并提示登录成功或者失败\n\n具体代码已上传至github: [websocket-wxApp-login](https://github.com/mrabit/websocket-wxApp-login)\n\n参考地址:\n- [扫二维码登录思路（扫码登录思路）](https://www.meetqy.com/article?article_id=42 "扫二维码登录思路（扫码登录思路）")\n- [API · 小程序](https://mp.weixin.qq.com/debug/wxadoc/dev/api/ "API · 小程序")\n',
              is_html: 0,
              uname: "admin",
              create_time: "2017-11-05 00:10:57",
              release_time: "11月05,2017"
            },
            {
              id: 45,
              title: "小程序 - bing每日一图",
              reprint_url: "",
              content:
                "1. 小程序刚出来的时候使用过,当时炒的很火的小程序,不去试试水怎么可以,不过当时不对个人开发者开放,后来小程序对个人开发者开放后修改了部分代码并发布\n\n2. 当时博客前端代码是用`jQuery`的js框架,`bootstrap`的css框架,`requireJS`的模块化引入工具写的,后台代码由`ThinkPHP3.2` + `Mysql`实现.\n\n3. 小程序需要网站`HTTPS`化,正好服务器是阿里云的就直接申请了证书实现了网站的`SSL`.\n\n4. 博客写了个定时任务爬去Bing每日图片并存放在七牛云储存,所以小程序可以直接读取数据库里的数据去七牛云储存取数据出来.\n\n5. 前段时间学习了`Vue.js`就把博客重构了一遍,使用Vue.js + `express` + mysql实现了效果并利用`JWT`进行权限认证,`redis`储存JWT生成的token值,`websocket`进行后台管理系统的踢人操作.\n\n6. HTML版bing每日一图:\n[https://blog.mrabit.com/bing.html](https://blog.mrabit.com/bing.html)\n\n7. 小程序二维码:\n![![](/Uploads/Picture/2017-11-02/1509630999.jpg)](/Uploads/Picture/2017-11-02/1509630999.jpg)",
              is_html: 0,
              uname: "admin",
              create_time: "2017-11-02 21:56:55",
              release_time: "11月02,2017"
            },
            {
              id: 44,
              title: "nginx配置websocket的wss   ",
              reprint_url: "",
              content:
                "开发环境配置`websocket`踢人操作已实现,可上传到生产环境却出错了,\n出错的原因是生产环境使用的是`https`,报错如下:\n![](/Uploads/Picture/2017-11-02/1509555331.png)\n百度了半天找到结局方法是`websocket`也用`SSL`协议,即`wss`,\nhtml页面上的`ws`\n```javascript\nvar ws = new WebSocket('ws://blog.mrabit.com');\n```\n需要替换成`wss`:\n```javascript\nvar ws = new WebSocket('wss://blog.mrabit.com');\n```\n原以为这样就完工了,结果又出现报错:\n![](/Uploads/Picture/2017-11-02/1509555528.png)\n再次百度.......\n可以通`http`模块实现`wss`代理,需要修改`nginx`的代理配置,新增配置:\n```shell\n    location /wss {\n       proxy_pass http://127.0.0.1:8088/;\n       proxy_read_timeout 60s;\n       proxy_set_header Host $host;\n       proxy_set_header X-Real_IP $remote_addr;\n       proxy_set_header X-Forwarded-for $remote_addr;\n       proxy_http_version 1.1;\n       proxy_set_header Upgrade $http_upgrade;\n       proxy_set_header Connection 'Upgrade';\n    }\n```\n`html`上的`websocket`连接需要换成:\n```javascript\nvar ws = new WebSocket('wss://blog.mrabit.com/wss');\n```\n重启nginx,完工\n![](/Uploads/Picture/2017-11-02/1509555928.png)\n\n#### 参考地址:\n- [http://www.cnblogs.com/weidiao/p/7389744.html](http://www.cnblogs.com/weidiao/p/7389744.html)\n- [http://blog.csdn.net/chopin407/article/details/52937645](http://blog.csdn.net/chopin407/article/details/52937645![](/Uploads/Picture/2017-11-02/1509555528.png))",
              is_html: 0,
              uname: "admin",
              create_time: "2017-11-02 01:04:03",
              release_time: "11月02,2017"
            }
          ]
        }
      }
    };
  },
  head() {
    return {
      title: "首页"
    };
  }
};
</script>
