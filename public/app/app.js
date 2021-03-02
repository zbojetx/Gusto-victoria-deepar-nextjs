var canvasHeight = window.innerHeight;
var canvasWidth = window.innerWidth;


var filterIndex = localStorage.getItem('filtercode')

var effects = [
    '/effects/captain_hat',
    '/effects/chrown',
    '/effects/glass',
    '/effects/heart_glass_chef_hat',
];

// desktop, the width of the canvas is 0.66 * window height and on mobile it's fullscreen
if (window.innerWidth > window.innerHeight) {
    canvasWidth = Math.floor(window.innerHeight * 0.66);
}

var deepAR = DeepAR({
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    licenseKey: '8f2633b6844ab2867c047e39720dd12bfe094ef4511ffe171dd89a28cd7a7c5a84b2e4fd039b2f56',
    canvas: document.getElementById('deepar-canvas'),
    numberOfFaces: 1,
    libPath: '/lib',
    segmentationInfoZip: 'segmentation.zip',
    onInitialize: function () {
        deepAR.startVideo(true);
        deepAR.switchEffect(0, 'slot', effects[filterIndex]);
    }
});



deepAR.onCameraPermissionAsked = function () {
    console.log('camera permission asked');
};

deepAR.onCameraPermissionGranted = function () {
    console.log('camera permission granted');
};

deepAR.onCameraPermissionDenied = function () {
    console.log('camera permission denied');
};


deepAR.onImageVisibilityChanged = function (visible) {
    console.log('image visible', visible);
};

deepAR.onFaceVisibilityChanged = function (visible) {
    console.log('face visible', visible);
};

deepAR.downloadFaceTrackingModel('/lib/models-68-extreme.bin');



