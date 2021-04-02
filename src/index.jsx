import $ from "jquery"
import React from "react"
import {render} from "react-dom"
import {Post} from "@models/Post"
import json from "@/assets/json"
import WebpackLogo from "@/assets/webpack-logo.png"
import xml from "@/assets/data.xml"
import csv from "@/assets/data.csv"
import "@/babel"
import "@/styles/styles.css"
import "@/styles/scss.scss"
import "@/styles/sass.sass"


const App = () => (
  <div className="container">
    <h1>Webpack Course</h1>
    <hr />
    <div className="logo"></div>
    <hr />
    <pre></pre>
    <hr />

    <div className="box">
      <h2>Sass and Scss</h2>
    </div>
  </div>
)
render(<App />, document.getElementById('app'))


const post = new Post('Webpack Post Title', WebpackLogo)
$('pre').addClass('code').html(post.toString())


console.log('Post to String: ', post.toString())
console.log('JSON: ', json)
console.log('XML: ', xml)      
console.log('CSV: ', csv)
console.log(process.env.NODE_ENV)


