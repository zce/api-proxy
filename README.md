# douban-api-proxy

> 一个豆瓣 API 的反向代理配置，旨在解决豆瓣屏蔽小程序请求问题

经过摸索，豆瓣应该是根据 HTTP Referer 判断是否为小程序发起的请求，所以我们通过反向代理的方式修改源请求中的 Referer 解决。

至于有些朋友想在客户端直接修改请求 Referer 的话，我只能说不可能，你应该去补习一下基本功了，给你一个链接：

- [Fetch forbidden header names](https://fetch.spec.whatwg.org/#forbidden-header-name)

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

注意：你需要将域名和 SSL 证书换成自己的域名和证书。
