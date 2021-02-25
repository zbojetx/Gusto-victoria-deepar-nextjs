var canvasHeight = window.innerHeight;
var canvasWidth = window.innerWidth;

var filterIndex = localStorage.getItem('filtercode')

console.log(filterIndex)

var effects = [
    '/ass/lib/effects/background_segmentation',
    '/ass/lib/effects/aviators',
    '/ass/lib/effects/beard',
    '/ass/lib/effects/dalmatian',
    '/ass/lib/effects/flowers',
    '/ass/lib/effects/koala',
    '/ass/lib/effects/lion',
    '/ass/lib/effects/teddycigar'
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
    libPath: '/ass/lib',
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

function takeSC() {
    deepAR.takeScreenshot()
}



async function _uploadTos3 (blob) {
    let s3URL = await fetch(
        "https://ztjyg3beya.execute-api.ap-east-1.amazonaws.com/dev/presigned_url",
        {
            method: "POST",
        }
    );

    s3URL = await s3URL.json();

    console.log(s3URL);

    let uploadResult = await fetch(s3URL.url, {
        method: "PUT",
        headers: {
            "Content-Type": "image/jpeg",
        },
        body: blob,
    });

    // this.setState({
    //     isUploading: false,
    //     imageURL: `https://devb-upload.s3.ap-east-1.amazonaws.com/${s3URL.filename}`,
    // });
    console.log(uploadResult)

    console.log(`https://devb-upload.s3.ap-east-1.amazonaws.com/${s3URL.filename}`);
}


function startExternalVideo() {

    // create video element
    var video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.controls = true;
    video.setAttribute('playsinline', 'playsinline');
    video.style.width = '100%';
    video.style.height = '100%';

    // put it somewhere in the DOM
    var videoContainer = document.createElement('div');
    videoContainer.appendChild(video);
    videoContainer.style.width = '1px';
    videoContainer.style.height = '1px';
    videoContainer.style.position = 'absolute';
    videoContainer.style.top = '0px';
    videoContainer.style.left = '0px';
    videoContainer.style['z-index'] = '-1';
    document.body.appendChild(videoContainer);

    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        try {
            video.srcObject = stream;
        } catch (error) {
            video.src = URL.createObjectURL(stream);
        }

        setTimeout(function () {
            video.play();
        }, 50);
    }).catch(function (error) {

    });

    // tell the DeepAR SDK about our new video element
    deepAR.setVideoElement(video, true);
}


// deepAR.onVideoStarted = function () {
//     var loaderWrapper = document.getElementById('loader-wrapper');
//     loaderWrapper.style.display = 'none';
// };

deepAR.downloadFaceTrackingModel('/ass/lib/models-68-extreme.bin');



