<!--
  - Created by MiliGao on 2017/11/22
  - https://github.com/gyjddtang/vue-npm
 -->

<template>
    <section>
        <transition name="imageViewer">
            <div class="imageViewerMask" v-if="visible">
                <div class="imageViewerLayer" ref="imageViewerLayer">
                    <transition :name="listName">
                        <div
                                :class="['imageContainer', { imageFullScreen: isFullScreen }]"
                                :key="'imageBox' + currentIndex"
                                ref="imageContainer"
                                @mousedown.prevent="imageMousedown"
                        >
                            <div class="loading" v-if="imagesInfo[currentIndex] && !imagesInfo[currentIndex].onload"></div>
                            <img
                                    v-if="imagesInfo[currentIndex] && imagesInfo[currentIndex].onload"
                                    :src="imagesInfo[currentIndex].url"
                                    :style="imageStyle"
                                    class="image"
                                    ref="image"
                                    alt="图片"
                            />
                        </div>
                    </transition>
                    <transition-group name="bigButton">
                        <div class="prevButtonBox" @click="prev" v-show="showBigButton === 'prev'" key="bigButtonPrev">
                            <slot name="prevButton">
                                <div class="prevButton"></div>
                            </slot>
                        </div>
                        <div class="nextButtonBox" @click="next" v-show="showBigButton === 'next'" key="bigButtonNext">
                            <slot name="nextButton">
                                <div class="nextButton"></div>
                            </slot>
                        </div>
                    </transition-group>
                    <div class="zoomPercent" v-show="!isFullScreen && showZoomPercent">{{ Math.ceil(zoom * 100) + '%' }}</div>
                    <div class="pointBar">{{ currentIndex + 1 }} / {{ images.length }}</div>
                    <div class="handleBarBox" v-show="showHandleBar && !isFullScreen">
                        <slot name="handleBar">
                            <div class="handleBar">
                                <div class="button" @click="zoomAuto" :title="zoomType === 'natural' ? '适应窗口' : '实际尺寸'">
                                    <img v-show="zoomType === 'natural'" :src="require('./images/zoom_adapt.png')" alt="适应窗口">
                                    <img v-show="zoomType === 'adapt'" :src="require('./images/zoom_natural.png')" alt="实际尺寸">
                                </div>
                                <div class="button" @click="zoomIn"><img src="./images/zoom_in.png" alt="放大"></div>
                                <div class="button" @click="zoomOut"><img src="./images/zoom_out.png" alt="缩小"></div>
                                <div class="button prev" @click="prev"><div class="arrow"></div></div>
                                <div class="button next" @click="next"><div class="arrow"></div></div>
                                <div class="button" @click="leftRotate"><img src="./images/left_rotate.png" alt="左旋"></div>
                                <div class="button" @click="rightRotate"><img src="./images/right_rotate.png" alt="右旋"></div>
                                <div class="button" @click="palyPPT"><img src="./images/paly.png" alt="幻灯片"></div>
                            </div>
                        </slot>
                    </div>
                    <div v-show="!isFullScreen" class="closeButton" @click="$emit('update:visible', false)"><em></em></div>
                </div>
            </div>
        </transition>
        <div class="imagesCache"></div>
    </section>
</template>

<script>
    let zoomRatio = 0.02   // 缩放比率
    let zoomMax = 4   // 最大放大倍数

    export default {
        name: 'imageViewer',
        props: {
            images: {
                type: Array,
                required: true
            },
            defaultIndex: {
                type: Number,
                default: 0
            },
            visible: {
                type: Boolean,
                default: false
            },
            showHandleBar: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                currentIndex: void 0,
                zoom: 1,
                rotate: 0,
                listName: 'list-init',
                imageTransition: 'transform .2s',
                zoomType: 'natural',   // natural/adapt
                imagesInfo: [],
                mouseDown: { x: 0, y: 0 },
                mouseUp: { x: 0, y: 0 },
                mouseDrag: { x: 0, y: 0 },
                showZoomPercent: false,
                isFullScreen: false,
                showBigButton: ''
            }
        },
        computed: {
            imageStyle () {
                return {
                    // width: `${this.imagesInfo[this.currentIndex].w}px`,   // 兼容IE img宽度被压缩
                    minWidth: `${this.imagesInfo[this.currentIndex].w}px`,   // 兼容Firefox弹性盒子img的width超出父级，Firefox自动压缩到父级的width，height则不会
                    transform: `translate(${this.mouseDrag.x}px, ${this.mouseDrag.y}px) scale(${this.zoom}) rotate(${this.rotate}deg)`,
                    transition: this.imageTransition
                }
            }
        },
        watch: {
            imagesInfo (val) {
                val.map((ele, index) => {
                    if (index === this.currentIndex && ele.onload) {
                        this.initParms()
                    }   // 匹配到当前项，初始化参数，并计算zoom及zoom类型
                })
            },

            visible (val) {
                if (val) {
                    this.currentIndex = this.defaultIndex
                    this.loadImages()
                    // 注册鼠标滚轮事件
                    if (document.addEventListener) {
                        document.addEventListener('DOMMouseScroll', this.onMouseScroll)
                    }   // W3C
                    window.onmousewheel = document.onmousewheel = this.onMouseScroll   // IE/Opera/Chrome
                    // 注册全屏事件
                    document.addEventListener('fullscreenchange', this.fullscreenchange)
                    document.addEventListener('mozfullscreenchange', this.fullscreenchange)
                    document.addEventListener('webkitfullscreenchange', this.fullscreenchange)
                    document.addEventListener('msfullscreenchange', this.fullscreenchange)
                    // 注册键盘事件
                    document.addEventListener('keydown', this.keydown)
                    // 注册鼠标移动事件
                    document.addEventListener('mousemove', this.mousemove)
                } else {
                    this.listName = 'list-init'
                    if (document.addEventListener) {
                        document.removeEventListener('DOMMouseScroll', this.onMouseScroll)
                    }
                    window.onmousewheel = null
                    document.onmousewheel = null
                    document.removeEventListener('fullscreenchange', this.fullscreenchange)
                    document.removeEventListener('mozfullscreenchange', this.fullscreenchange)
                    document.removeEventListener('webkitfullscreenchange', this.fullscreenchange)
                    document.removeEventListener('msfullscreenchange', this.fullscreenchange)
                    document.removeEventListener('keydown', this.keydown)
                    document.removeEventListener('mousemove', this.mousemove)
                }
            },

            zoom () {
                if (this.showZoomPercent) return
                this.showZoomPercent = true
                setTimeout(() => {
                    this.showZoomPercent = false
                }, 1500)
            }
        },
        methods: {
            loadImages () {
                this.imagesInfo = []
                document.querySelector('.imagesCache').innerHTML = null
                // 优先加载当前项
                let img = new Image()
                img.src = this.images[this.currentIndex]
                // 加载全部图片
                this.images.map((ele, index) => {
                    this.imagesInfo.push({ url: ele, onload: false, w: 400, h: 400 })
                    let img = new Image()
                    img.onload = (e) => {
                        //console.log(index, e.target.width, e.target.height)
                        this.imagesInfo.splice(index, 1, { url: ele, onload: true, w: e.target.width, h: e.target.height })
                    }
                    img.src = ele
                    document.querySelector('.imagesCache').appendChild(img)   // 缓存图片
                })
            },

            onMouseScroll (e) {
                if (this.isFullScreen) return
                /*
                 ** wheelDelta: IE/Opera/Chrome
                 ** detail: Firefox
                 */
                if (e.wheelDelta > 0 || e.detail < 0) {
                    this.zoomIn()
                } else if (e.wheelDelta < 0 || e.detail > 0) {
                    this.zoomOut()
                }
            },

            imageMousedown (e) {
                if (this.isFullScreen) return
                this.imageTransition = 'none'
                this.mouseDown.x = e.clientX
                this.mouseDown.y = e.clientY
                this.$refs.imageContainer.addEventListener('mousemove', this.imageDraging)
                this.$refs.imageContainer.addEventListener('mouseup', this.imageDragEnd)
                this.$refs.imageContainer.addEventListener('mouseleave', this.imageDragEnd)
            },

            imageDraging (e) {
                this.mouseDrag.x = this.mouseUp.x + e.clientX - this.mouseDown.x
                this.mouseDrag.y = this.mouseUp.y + e.clientY - this.mouseDown.y
            },

            imageDragEnd (e) {
                this.$refs.imageContainer.removeEventListener('mousemove', this.imageDraging)
                this.$refs.imageContainer.removeEventListener('mouseup', this.imageDragEnd)
                this.$refs.imageContainer.removeEventListener('mouseleave', this.imageDragEnd)
                this.mouseUp.x = this.mouseDrag.x
                this.mouseUp.y = this.mouseDrag.y
                this.imageTransition = 'transform .2s'
            },

            next () {
                this.listName = 'list-next'
                if (this.currentIndex === this.images.length - 1) {
                    this.currentIndex = 0
                } else {
                    this.currentIndex++
                }
                this.initParms()
            },

            prev () {
                this.listName = 'list-prev'
                if (this.currentIndex === 0) {
                    this.currentIndex = this.images.length - 1
                } else {
                    this.currentIndex--
                }
                this.initParms()
            },

            zoomIn () {
                this.zoom = this.zoom >= zoomMax ? zoomMax : this.zoom + zoomRatio
            },

            zoomOut () {
                this.zoom = this.zoom <= 0.04 ? 0.04 : this.zoom - zoomRatio
            },

            zoomAuto () {
                if (this.zoomType === 'natural') {
                    this.zoomType = 'adapt'
                    let { width: imgW, height: imgH } = this.$refs.image
                    let { offsetWidth: viewW, offsetHeight: viewH } = this.$refs.imageContainer
                    if (imgW / imgH <= viewW / viewH) {   // 图片的宽高比 和 容器宽高比
                        this.zoom = viewH / imgH
                    } else {
                        this.zoom = viewW / imgW
                    }
                } else {
                    this.zoomType = 'natural'
                    this.zoom = 1
                }
                this.initLocation()
            },

            initParms () {
                this.computedZoom()   // zoom
                this.initLocation()   // location
                this.rotate = 0   // rotate
            },

            initLocation () {
                this.mouseDown.x = 0
                this.mouseDown.y = 0
                this.mouseUp.x = 0
                this.mouseUp.y = 0
                this.mouseDrag.x = 0
                this.mouseDrag.y = 0
            },

            computedZoom () {
                let { w: imgW, h: imgH } = this.imagesInfo[this.currentIndex]
                let { offsetWidth: viewW, offsetHeight: viewH } = this.$refs.imageContainer
                if (imgW <= viewW && imgH <= viewH) {
                    this.zoom = 1
                    this.zoomType = 'natural'   // 原始尺寸
                } else {
                    if (imgW / imgH <= viewW / viewH) {   // 图片的宽高比 和 容器宽高比
                        this.zoom = viewH / imgH
                    } else {
                        this.zoom = viewW / imgW
                    }
                    this.zoomType = 'adapt'   // 适应窗口
                }
            },

            leftRotate () {
                if (this.isFullScreen) return
                this.rotate -= 90
            },

            rightRotate () {
                if (this.isFullScreen) return
                this.rotate += 90
            },

            palyPPT () {
                // 全屏事件
                let docElm = this.$refs.imageViewerLayer
                if (docElm.requestFullscreen) {   // W3C
                    docElm.requestFullscreen()
                } else if (docElm.mozRequestFullScreen) {   // FireFox
                    docElm.mozRequestFullScreen()
                } else if (docElm.webkitRequestFullScreen) {   // Chrome等
                    docElm.webkitRequestFullScreen()
                } else if (docElm.msRequestFullscreen) {   // IE11
                    docElm.msRequestFullscreen()
                }
            },

            fullscreenchange (e) {
                //console.log(e)
                this.isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
                //console.log(this.isFullScreen)
                if (this.isFullScreen) {
                    setTimeout(() => {
                        this.initParms()
                    }, 60)   // 全屏事件DOM还未发生改变
                    this.setTimer()
                } else {
                    this.initParms()
                    this.clearTimer()
                }
            },

            setTimer () {
                this.timer = setInterval(() => {
                    this.next()
                }, 3000)
            },

            clearTimer () {
                window.clearInterval(this.timer)
                this.timer = null
            },

            keydown (e) {
                switch (e.keyCode) {
                    case 37: // 左
                        this.prev()
                        if (this.isFullScreen) {
                            this.clearTimer()
                            this.setTimer()
                        }
                        break
                    case 38: // 上
                        this.leftRotate()
                        break
                    case 39: // 右
                        this.next()
                        if (this.isFullScreen) {
                            this.clearTimer()
                            this.setTimer()
                        }
                        break
                    case 40: // 下
                        this.rightRotate()
                        break
                }
            },

            mousemove (e) {
                if (this.isFullScreen) return
                let maxW = this.$refs.imageContainer ? this.$refs.imageContainer.offsetWidth : window.screen.width
                if (e.clientX <= 200) {
                    this.showBigButton = 'prev'
                } else if (e.clientX >= maxW - 200) {
                    this.showBigButton = 'next'
                } else {
                    this.showBigButton = ''
                }
            }
        }
    }
</script>

<style spaced>
    .imagesCache {
        display: none;
    }

    .imageViewerMask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
        user-select: none;
    }

    .imageViewerLayer {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        position: relative;
    }

    .imageContainer {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: grab;
    }

    .imageContainer.imageFullScreen {
        cursor: none;
    }

    .imageContainer .loading {
        width: 40px;
        height: 40px;
        background: transparent;
        border-radius: 50%;
        border: 2px solid;
        border-color: rgba(255, 255, 255, .9) transparent;
        animation: loading 2s infinite;
    }

    @keyframes loading {
        50% {
            transform: rotate(360deg) scale(1.3);
        }
        100% {
            transform: rotate(0deg) scale(1);
        }
    }

    .imageContainer .image {
        display: block;
        user-select: none;
    }

    .handleBarBox {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
    }

    .handleBar {
        height: 50px;
        padding: 0 10px;
        border-radius: 25px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        transition: .4s;
        user-select: none;
    }

    .handleBar:hover {
        background: rgba(255, 255, 255, .2);
    }

    .handleBar .button {
        width: 28px;
        height: 28px;
        background: rgba(0, 0, 0, .5);
        border-radius: 50%;
        margin: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .handleBar .button:hover {
        background: rgba(0, 0, 0, .7);
        transform: scale(1.1);
    }

    .handleBar .button img {
        width: 16px;
    }

    .handleBar .button.next .arrow {
        transform: translateX(3px);
    }

    .handleBar .button.prev .arrow {
        transform: rotate(180deg) translateX(3px);
    }

    .handleBar .button .arrow::before,
    .handleBar .button .arrow::after {
        content: "";
        display: block;
        width: 2px;
        height: 8px;
        border-radius: 2px;
        background: #fff;
        transform-origin: bottom right;
        transform: rotate(-45deg);
    }

    .handleBar .button .arrow::after {
        transform-origin: top right;
        transform: rotate(45deg);
    }

    .pointBar {
        position: absolute;
        left: 50%;
        bottom: 60px;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, .5);
        font-size: 14px;
    }

    .prevButtonBox,
    .nextButtonBox {
        position: absolute;
        top: 50%;
        left: 2%;
        transform: translateY(-50%);
    }

    .nextButtonBox {
        left: auto;
        right: 2%;
    }

    .prevButton,
    .nextButton {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, .5);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 4px rgba(0, 0, 0, .5);
    }

    .nextButton::before,
    .nextButton::after,
    .prevButton::before,
    .prevButton::after {
        content: "";
        display: block;
        width: 3px;
        height: 22px;
        background: rgba(255, 255, 255, .5);
        border-radius: 1px;
        box-shadow: 0 0 4px rgba(0, 0, 0, .5);
    }

    .nextButton:hover,
    .prevButton:hover {
        border-color: #fff;
    }

    .nextButton:hover::before,
    .nextButton:hover::after,
    .prevButton:hover::before,
    .prevButton:hover::after {
        background: #fff;
    }

    .prevButton::before {
        transform: rotate(45deg) translateY(6px);
    }

    .prevButton::after {
        transform: rotate(-45deg) translateY(-6px);
    }

    .nextButton::before {
        transform: rotate(-45deg) translateY(6px);
    }

    .nextButton::after {
        transform: rotate(45deg) translateY(-6px);
    }

    .zoomPercent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 30px;
        width: 66px;
        text-align: center;
        border-radius: 15px;
        background: rgba(0, 0, 0, .5);
        color: rgba(255, 255, 255, .9);
        font-size: 14px;
        user-select: none;
    }

    .closeButton {
        width: 0;
        height: 0;
        border: 30px solid rgba(0, 0 ,0, .5);
        border-top-width: 10px;
        border-right-width: 10px;
        border-bottom-left-radius: 100%;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .closeButton:hover em,
    .closeButton:hover em::after {
        background: #fff;
    }

    .closeButton em {
        display: block;
        width: 2px;
        height: 16px;
        background: rgba(255, 255, 255, .5);
        border-radius: 1px;
        transform: rotate(-45deg) translate(-8px, 0px);
    }

    .closeButton em::after {
        content: "";
        display: block;
        width: 2px;
        height: 16px;
        background: rgba(255, 255, 255, .5);
        border-radius: 1px;
        transform: rotate(90deg);
    }

    .list-next-enter,
    .list-prev-leave-to {
        transform: translateX(100%);
    }

    .list-next-leave-to,
    .list-prev-enter {
        transform: translateX(-100%);
    }

    .list-prev-enter-active,
    .list-prev-leave-active,
    .list-next-enter-active,
    .list-next-leave-active {
        transition: transform .4s;
    }

    .imageViewer-enter,
    .imageViewer-leave-to {
        opacity: 0;
    }

    .imageViewer-enter-active,
    .imageViewer-leave-active {
        transition: opacity .4s;
    }

    .bigButton-enter,
    .bigButton-leave-to {
        opacity: 0;
    }

    .bigButton-enter-active {
        transition: opacity .5s;
    }

    .bigButton-leave-active {
        transition: opacity 1s;
    }
</style>
