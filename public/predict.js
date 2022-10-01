async function uploadFile() {
    let formData = new FormData();
    formData.append("fileupload", image_selector.files[0]);
    await fetch('http://localhost:3000/upload', {
        method: "POST",
        body: formData
    });

    alert('Image has been uploaded!');
}

$("#image_selector").change(function() {
    let reader = new FileReader();
    reader.onload = function() {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image_selector").prop("files")[0];
    reader.readAsDataURL(file);
});

let model;
(async function() {
    alert('function is running!');
    model = await tf.loadLayersModel("http://localhost:3000/tfjs_data/model.json");
    alert('model loaded successfully')
    $(".progress-bar").hide();
})();

// More pre-processing to be added here later

$("#predict-button").click(async function() {
    // console.log("inside the vgg preProcessing:");
    alert('Predict Button clicked');
    let image = $('#selected-image').get(0);

    // let tensor = preprocessImage(files,$("#model-selector").val());
    let tensor = preprocessImage(image)
    let startTime = new Date().getTime();
    let prediction = await model.predict(tensor).dataSync();
    let endTime = new Date().getTime();
    let top5 = Array.from(prediction)
        .map(function(p, i) {
            return {
                probability: p,
                className: IMAGENET_CLASSES[i]
            };
        }).sort(function(a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);
    let seconds = (Math.abs(endTime - startTime) / (1000) % 60);
    console.log("Time for prediction : " + seconds)
    $("#prediction-time").empty();
    $("#prediction-time").append(`<p>Prediction time: ${seconds} seconds`)
    $("#prediction-list").empty();
    top5.forEach(function(p) {
        $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
    });

});

// function preprocessImage(image) {
//     //convert the image data to a tensor 
//     let tensor = tf.browser.fromPixels(image)
//         //resize to 50 X 50
//     const resized = tf.cast(
//         tf.image.resizeBilinear(tensor, [300, 300]).toFloat(),
//         'float32'
//     )
//     console.log(resized)
//     let convertedTensor = tf.image.resizeBilinear(tensor, [300, 300]).div(tf.scalar(255))
//     console.log(convertedTensor)


//     // Normalize the image 
//     // const offset = tf.scalar(255.0);
//     // const normalized = tf.scalar(1.0).sub(resized.div(offset));
//     // //We add a dimension to get a batch shape 
//     const batched = convertedTensor.expandDims(0)

//     return batched;
// }

function preprocessImage(image, modelName) {
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat(); //.sub(meanImageNetRGB)

    let meanImageNetRGB = {
        red: 123.68,
        green: 116.779,
        blue: 103.939
    };

    let indices = [
        tf.tensor1d([0], "int32"),
        tf.tensor1d([1], "int32"),
        tf.tensor1d([2], "int32")
    ];

    let centeredRGB = {
        red: tf.gather(tensor, indices[0], 2)
            .sub(tf.scalar(meanImageNetRGB.red))
            .reshape([50176]),
        green: tf.gather(tensor, indices[1], 2)
            .sub(tf.scalar(meanImageNetRGB.green))
            .reshape([50176]),
        blue: tf.gather(tensor, indices[2], 2)
            .sub(tf.scalar(meanImageNetRGB.blue))
            .reshape([50176])
    };

    let processedTensor = tf.stack([
            centeredRGB.red, centeredRGB.green, centeredRGB.blue
        ], 1)
        .reshape([224, 224, 3])
        .reverse(2)
        .expandDims();

    return processedTensor;
}