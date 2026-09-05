const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const rootDirectory = path.resolve(__dirname);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(function (request, response) {
  const requestUrl = new URL(
    request.url,
    `http://${request.headers.host}`
  );

  let requestedPath = decodeURIComponent(requestUrl.pathname);

  if (requestedPath === "/") {
    requestedPath = "index.html";
  } else {
    requestedPath = requestedPath.replace(/^\/+/, "");
  }

  const filePath = path.resolve(rootDirectory, requestedPath);

  const isInsideRoot =
    filePath === rootDirectory ||
    filePath.startsWith(`${rootDirectory}${path.sep}`);

  if (!isInsideRoot) {
    response.writeHead(403, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    response.end("접근할 수 없는 경로입니다.");
    return;
  }

  fs.stat(filePath, function (statError, stats) {
    if (statError || !stats.isFile()) {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      response.end("파일을 찾을 수 없습니다.");
      return;
    }

    fs.readFile(filePath, function (readError, data) {
      if (readError) {
        response.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8"
        });

        response.end("파일을 읽는 중 오류가 발생했습니다.");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();

      const contentType =
        contentTypes[extension] ||
        "application/octet-stream";

      response.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store"
      });

      response.end(data);
    });
  });
});

server.listen(port, "0.0.0.0", function () {
  console.log("");
  console.log("==========================================");
  console.log("에코몬 성장 게임 서버가 실행되었습니다.");
  console.log(`주소: http://localhost:${port}`);
  console.log("종료하려면 Ctrl+C를 누르세요.");
  console.log("==========================================");
  console.log("");
});