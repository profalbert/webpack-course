const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')


// переменные, показывающие в каком режиме мы сейчас разрабатываем
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'


const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all', // Это указывает, 
      // какие фрагменты будут выбраны для оптимизации.
      // Предоставление all может быть особенно эффективным, 
      // потому что это означает, что куски могут совместно 
      // использоваться даже между асинхронными и неасинхронными фрагментами
    },
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(), // минифицируем и оптимизируем css файлы 
    ]
  }

  return config
}


// используем фиксированные паттерны webpack, 
// динамическое название: [name] - берется из entry, 
// также используем уникальный хэш (чтобы не было проблем с кешем): [contenthash]
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`


const cssLoaders = (extra) => {
  const loaders = [    
    'css-loader',
  ] // webpack по правилу обрабатывает эти loaders справа налево (снизу вверх)!

  if (isDev) {
    loaders.unshift('style-loader')
  } else {
    loaders.unshift({
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/dist/';
        },
      },
    })
  }

  if (extra) {
    loaders.push(...extra)
  }

  return loaders
}


const babelOptions = (preset) => { // настройка параметров в loaders (для babel)
  const options = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  }

  if (preset) {
    options.presets = options.presets.concat(preset)
  }

  return options
}


const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader') // подключаем eslint для .js файлов 
  }

  return loaders
}


const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      // title: 'title in Head', // это свойство будет указано в html в теге <title>title in Head</title> 
      // не работает, если указано свойство template (см. ниже)
      template: './index.html', // Указываем главный шаблон html
      minify: { // Определяет, следует ли и каким образом 
        // минимизировать код
        collapseWhitespace: isProd, // сворачиваем пустое пространство если isProd === true
      }
    }),
    new CleanWebpackPlugin(), // По умолчанию этот плагин удаляет 
    // все файлы внутри каталога output.path webpack, 
    // а также все неиспользуемые ресурсы webpack после 
    // каждой успешной перестройки (build)
    new CopyWebpackPlugin({ // Копирует отдельные файлы или целые каталоги, 
    // которые уже существуют, в каталог сборки
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({ // Этот плагин извлекает CSS 
    // в отдельные файлы. Он создает файл CSS для каждого файла JS, 
    // который содержит CSS
      filename: filename('css'),
    }),
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin()) // Пакет в webpack, 
    // визиализирующий размер выходных файлов webpack с 
    // помощью интерактивной масштабируемой древовидной карты. 
    // Нужен для помощи в оптимизации проекта.
  }

  return base
}



module.exports = {
  context: path.resolve(__dirname, 'src'), // Базовый каталог, абсолютный путь, 
  // для разрешения точек входа и загрузчиков из конфигурации (нужен, чтобы не прописывать один и тот же путь в другие настройках)
  mode: 'development', // По умолчанию делаем этот параметр один из этих варинтов: (mode: 'none' | 'development' | 'production') 
  // Параметр mode указывает webpack конфигурации, 
  // что необходимо соответствующим образом 
  // использовать встроенные оптимизации (по умолчанию).
  entry: { // Точка или точки, 
  // с которых следует начать процесс объединения приложений. 
  // Если передан массив, то будут обработаны все элементы.
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts',
  },
  output: { // Настройка параметров output конфигурации сообщает webpack, 
  // куда сохранять скомпилированные файлы на диск. 
  // Обратите внимание, что хотя может быть несколько entry точек, 
  // output указана только одна конфигурация
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: { // Настройка разрешения модулей
    extensions: ['.js', '.json', '.ts'], // это параметр, определяет 
    // какие расширения нам понимать по умолчанию
    alias: { // Создавайте псевдонимы для упрощения импорта 
    // или запроса определенных модулей
      '@': path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/models'),      
    }
  },
  optimization: optimization(), // оптимизируем сборку 
  // (например, чтобы не подключать два раза одну и ту же библиотеку)
  devServer: { // Этот набор параметров подбирается webpack-dev-server (нужен для быстрой разработки приложения) и 
  // может использоваться для изменения его поведения 
  // различными способами
    port: 4200,
    // open: true, // открывать ли в новом окне браузера?
    hot: isDev, // Горячая замена модулей (HMR) заменяет, 
    // добавляет или удаляет модули во время работы приложения без полной перезагрузки
  },
  devtool: isDev ? 'source-map' : false, // Эта опция определяет, 
  // будут ли и как создаваться исходные карты. 
  // Например, при использовании debugger мы попадем на наш код 
  // (как в нашем файлике), а не скомпилированный или обработанный файл, 
  // что помогает концентрироваться на своем коде.
  plugins: plugins(), // Плагины - это основа веб-пакета.
  // Они служат для выполнения всего остального, 
  // чего не может сделать загрузчик.
  // Поскольку плагины могут принимать аргументы/параметры, 
  // вы должны передать новый экземпляр свойству plugins 
  // в конфигурации вашего веб-пакета.
  module: {
    rules: [ // loaders (rules) - добавление возможностей в webpack, чтобы он мог работать с файлами других расширений (не js)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(['@babel/preset-typescript']),
        },
      },
      {
        test: /\.[jt]sx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(['@babel/preset-react'])
        },
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders(['sass-loader']),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(xml)$/,
        use: ['xml-loader'],
      },
      {
        test: /\.(csv)$/,
        use: ['csv-loader'],
      },
    ]
  }
}

