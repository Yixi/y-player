## Y-Player

一个支持多种音频格式的音乐播放器 / A music player supporting multiple audio formats

### Features / 功能特性

- 🎵 支持多种音频格式：MP3, WAV, FLAC, APE, OGG, M4A, AAC, OPUS
- 🎨 现代化、美观的用户界面
- ▶️ 完整的播放控制：播放、暂停、上一首、下一首
- 🔊 音量控制
- ⏱️ 进度条及时间显示，支持拖动跳转
- 📋 播放列表管理
- 📁 支持批量上传音乐文件
- 🎬 播放中的动态可视化指示器

### Development / 开发

#### dev

`yarn dev`

#### build

`yarn build`

#### test

`yarn test`

#### lint

`yarn lint`

### Usage / 使用方法

1. 启动应用后，点击「添加音乐文件」按钮
2. 选择一个或多个音频文件（支持多选）
3. 文件加载后自动显示播放控制界面
4. 使用播放控制按钮控制音乐播放
5. 在播放列表中点击任意曲目可切换播放

### Supported Formats / 支持的格式

- **有损格式 / Lossy Formats**: MP3, OGG, M4A, AAC, OPUS
- **无损格式 / Lossless Formats**: WAV, FLAC, APE (browser support varies)

> 注意：FLAC 在现代浏览器中原生支持，APE 格式的支持取决于浏览器。
>
> Note: FLAC is natively supported in modern browsers, APE support depends on the browser.
