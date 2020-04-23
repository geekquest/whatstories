WhatStories
===========

Tell stories with text.

```javascript
const {ScrollingRenderer, WordByWordRenderer} = require('./whatstories');

const YOUR_STORY = 'Type your story here and get it rendered to an animated GIF';

const common = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    imageQuality: 10
}

WordByWordRenderer(400, 400, {
    ...common,
    wordsPerMin: 100
}).render(YOUR_STORY, 'basic-example.gif');

ScrollingRenderer(400, 400, {
    ...common, 
    frameRate: 3, 
    imageQuality: 15, 
    scrollSpeed: 1.5
}).render(YOUR_STORY, 'scrolling-example.gif');
```
