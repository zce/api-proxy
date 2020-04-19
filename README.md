# douban-api-proxy

[![Build Status][travis-image]][travis-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> 一个豆瓣 API 的反向代理配置，旨在解决豆瓣屏蔽小程序请求问题

## 免费服务

> **注意：搜索接口由于官方问题暂时无法正常工作**

为了帮助更多初学者或是爱好者，我个人准备了一个反向代理服务器（免费开放）。希望各位珍惜资源切勿滥用，谢谢！

### 接口地址：

- https://douban.uieee.com （已备案）
- https://douban-api.uieee.com （已备案）
- https://douban-api.now.sh
- https://douban-api.zce.now.sh
- https://douban-api-git-master.zce.now.sh

### 接口文档：

由于是直接转发官方的接口，所以完全跟官方的接口相同，文档参考官方即可：~~https://developers.douban.com/wiki/?title=api_v2~~ （最近官方文档关停，我重新整理了一份，往下看）

### 接口限流说明：

10000 次 / 1 小时，由于是豆瓣官方的限流，所以所有使用我搭建的这个反向代理服务的朋友都是共享这 10000 次请求的，我也没办法再去提高这个数字（普通个人用户是 100 次 / 1 小时），所以还是希望大家不要滥用。

> P.S. 我搭建的这个免费的服务中接口权限更高，可以使用影评、图书、音乐之类的接口，原因是我在代理请求的同时额外添加了一个 `apikey` 查询参数（由于特殊原因就不公开这个 KEY 了）。

### 支持 CORS

代理服务支持 CORS 调用。

## 解决方案（原理）

经过排查和摸索，豆瓣应该是根据 HTTP Referer 判断是否为小程序内发起的请求，所以我们**通过反向代理的方式修改源请求中的 Referer 解决**。

至于有些朋友想在客户端直接修改请求 Referer 的话，我只能说不可能，你应该去补习一下基本功，给你一个链接：

- [Fetch forbidden header names](https://fetch.spec.whatwg.org/#forbidden-header-name)

### Nginx

还有些朋友不了解 NGINX，最近总是跟我说：“我看到你的这个配置了，然后应该怎么操作呢？”，这里我只能很“不负责”的告诉大家：自行 Google `什么是 NGINX` / `NGINX 基本使用`。

```conf
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;

  ssl_certificate /var/www/douban.uieee.com/certs/douban.uieee.com.pem;
  ssl_certificate_key /var/www/douban.uieee.com/certs/douban.uieee.com.key;

  server_name douban.uieee.com;

  location / {
    proxy_pass https://api.douban.com;
    proxy_redirect off;

    # 核心在这里
    proxy_set_header Referer "https://www.douban.com";
  }
}
```

[Source file](nginx.conf)

注意：你需要将域名和 SSL 证书换成自己的域名和对应的证书！如果你有域名你可以去申请免费的证书（letsencrypt、aliyun 都可以提供）。

### Node Proxy

我这里使用的是 ZEIT Now Lambdas (Serverless Functions)

[Source file](proxy.js)

## 豆瓣 API 文档

豆瓣 API 服务计划对外关闭，官方 API 已经下线，考虑到众多初学者的需要我重新整理了一份

- https://github.com/zce/douban-api-docs

## 免责声明

本仓库只是为了“部落”的崛起，如涉及侵犯个人或者团体利益，请与我取得联系，我将主动删除一切相关资料，谢谢！

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me)


[travis-image]: https://img.shields.io/travis/zce/douban-api-proxy.svg
[travis-url]: https://travis-ci.org/zce/douban-api-proxy
[dependency-image]: https://img.shields.io/david/zce/douban-api-proxy.svg
[dependency-url]: https://david-dm.org/zce/douban-api-proxy
[devdependency-image]: https://img.shields.io/david/dev/zce/douban-api-proxy.svg
[devdependency-url]: https://david-dm.org/zce/douban-api-proxy?type=dev
[style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[style-url]: https://standardjs.com/
