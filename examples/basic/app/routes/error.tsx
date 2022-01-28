export default function Error() {
  return (
    <main>
      <h1>出错啦 Errored</h1>
      <p>
        一般出现这个问题，是因为 APP ID 或 Secret 配置错误。请检查你的配置。
      </p>
      <p>
        Usually, it is coursed with a wrong App ID or Secret. Please check your
        config file.
      </p>
      <hr />
      <p>
        另外，建议不要使用 `process.env.xxx`
        的方式设定读取环境变量，可能会在某些情况下被硬编码进打包。
      </p>
      <p>
        Besides, it is recommended not to use `process.env.xxx` to read the
        config from env, sometimes may be hardcoded into the built files.
      </p>
    </main>
  );
}
