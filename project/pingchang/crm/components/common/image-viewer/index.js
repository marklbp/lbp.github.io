import imageViewer from './image-viewer';

imageViewer.install = function (Vue) {
    Vue.component(imageViewer.name, imageViewer)
}

export default imageViewer;
