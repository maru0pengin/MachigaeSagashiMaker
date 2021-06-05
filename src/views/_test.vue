<template>
  <div>
    <h3 class="description">間違え位置を設定してください</h3>
    <hr />
    <br />
    <button @click="remove">リセット</button>
    <button @click="click">Try</button>
    <div id="canvas" ref="srcimg" class="block border-2 bg-red-100 absolute top-[140px] opacity-50 z-10"></div>

    <img src="@/assets/test.png" class="absolute top-[140px]"/>
    <img src="" ref="img" class="img"/>
  </div>
</template>

<script>
const WIDTH = 400
const HEIGHT = 225
import * as PIXI from 'pixi.js' // node_modulesから PIXI.jsをインポート

export default {
  name: 'setDifferences',
  data() {
    return {
      app: null,
      stage:null,
      dragging : false,
      renderTexture: null,
      resources: null,
      imgPath: null,
      differences: [],
      scene: null,
      brush_line: null,
      brush_line_circle: null,
      deleteFlag: false, //間違えの追加か、削除か、切り替えのフラグ
      lineFlag:true
    }
  },
  mounted: async function() {
    this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT })
    this.stage = this.app.stage;
    document.getElementById('canvas').appendChild(this.app.view)
    this.app.renderer = new PIXI.autoDetectRenderer(WIDTH,HEIGHT,{preserveDrawingBuffer: true});
    this.app.loader.load(this.setup);
  },
  methods: {
    setup() {
      this.brush_line = new PIXI.Graphics()
      //this.brush_line.lineStyle(0);
      this.brush_line.beginFill(0xff0000,1)
      this.brush_line.lineStyle(20,0xff0000,1);
      this.brush_line.endFill()

      this.brush_line_circle = new PIXI.Graphics()
      //this.brush_line.lineStyle(0);
      this.brush_line_circle.beginFill(0xff0000,1)
      this.brush_line_circle.drawCircle(0, 0, 10)
      this.brush_line_circle.endFill()

      this.app.renderer.backgroundColor = 0xffffff
      this.renderTexture = PIXI.RenderTexture.create(this.app.screen.width, this.app.screen.height);
      const renderTextureSprite = new PIXI.Sprite(this.renderTexture);
      this.stage.addChild(renderTextureSprite);
      this.app.stage.interactive = true;
      this.app.stage.on('pointerdown', this.pointerDown);
      this.app.stage.on('pointerup', this.pointerUp);
      this.app.stage.on('pointermove', this.pointerMove);
    },
    pointerMove(event) {
      const point = event.data.global
      if (this.dragging) {
        //console.log(event.data.global)
        if(this.lineFlag){
          this.brush_line.lineTo(point.x,point.y)
          this.app.renderer.render(this.brush_line, this.renderTexture, false, null, false);

          this.brush_line_circle.position.copyFrom(event.data.global);
          this.app.renderer.render(this.brush_line_circle, this.renderTexture, false, null, false);

          this.brush_line.moveTo(point.x,point.y)
          this.lineFlag = false
        }
        else{
          this.brush_line.lineTo(point.x,point.y)
          this.app.renderer.render(this.brush_line, this.renderTexture, false, null, false);

          this.brush_line_circle.position.copyFrom(event.data.global);
          this.app.renderer.render(this.brush_line_circle, this.renderTexture, false, null, false);
          
          this.brush_line.moveTo(point.x,point.y)
          this.lineFlag = true
        }

      }
    },
    pointerDown(event) {
      const point = event.data.global
      this.brush_line.moveTo(point.x,point.y)
      this.dragging = true;
      this.lineFlag = false
      this.pointerMove(event);
    },
    pointerUp(event) {
      const point = event.data.global
      if(!this.lineFlag){
        this.brush_line.lineTo(point.x,point.y)
        this.app.renderer.render(this.brush_line, this.renderTexture, false, null, false);
      }
      this.dragging = false;
      this.lineFlag = true
    },
    remove() {
      this.app.stage.removeChildren()
      this.app.loader.load(this.setup);
    },
    async click() {
    }
  },
}
</script>

<style lang="sass" scoped>
.correctBox
  width: 300px

.v-leave-active,
.v-enter-active
  transition: opacity 0.2s
.v-enter,
.v-leave-to
  opacity: 0
</style>
