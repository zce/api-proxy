# douban-api-proxy

> 一个豆瓣 API 的反向代理配置，旨在解决豆瓣屏蔽小程序请求问题

经过排查和摸索，豆瓣应该是根据 HTTP Referer 判断是否为小程序内发起的请求，所以我们**通过反向代理的方式修改源请求中的 Referer 解决**。

至于有些朋友想在客户端直接修改请求 Referer 的话，我只能说不可能，你应该去补习一下基本功了，给你一个链接：

- [Fetch forbidden header names](https://fetch.spec.whatwg.org/#forbidden-header-name)

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
    proxy_redirect     off;

    proxy_set_header   Referer          "https://www.douban.com";
  }
}
```

注意：你需要将域名和 SSL 证书换成自己的域名和对应的证书！如果你有域名你可以去申请免费的证书（letsencrypt、阿里云 都可以提供）。
