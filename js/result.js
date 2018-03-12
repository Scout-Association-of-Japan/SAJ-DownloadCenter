var ALL_INTENT_COUNT = 0;
var ALL_ENTITY_COUNT = 0;
var ALL_PREBUILT_ENTITY_COUNT = 0;
var ALL_LBELED_UTTERANCES_COUNT = 0;
var INTENTS_NAME = [];
var INTENTS_COUNT = [];
var ENTITIES_NAME = [];
var ENTITIES_COUNT = [];
var DEFAULT_COLORS = ['#3F51B5','#2196F3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#FFC107','#fb8c00','#ff5722','#f44336','#e91e63','#9c27b0','#673AB7'];

function onload()
{
  $('#wrap').css('display','none');
  var h = $(window).height();
  $('#loader-bg ,#loader').height(h).css('display','block');
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(render);
}

function render()
{
  $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps/"+ APP_ID +"/export",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",API_KEY);
        },
        type: "GET",
        // Request body
        data: "{body}",
    })
    .done(function(data){
        //console.log(data);
        makeEachValue(data);
        
    })
    .fail(function() {
    });
}


function makeEachValue(data)
{
  ALL_ENTITY_COUNT = data.entities.length;
  //ENTITIESリストの作成
  for(i=0; i<data.entities.length; i++)
  {
    ENTITIES_NAME[i] = data.entities[i].name;
    ENTITIES_COUNT[i] = 0;
  }

  ALL_INTENT_COUNT = data.intents.length;
  //INTENTSリストの作成
  for(i=0; i<data.intents.length; i++)
  {
    INTENTS_NAME[i] = data.intents[i].name;
    INTENTS_COUNT[i] = 0;
  }

  ALL_PREBUILT_ENTITY_COUNT = data.bing_entities.length;
  ALL_LBELED_UTTERANCES_COUNT = data.utterances.length;

  for(i=0; i< data.utterances.length; i++)
  {
    var intent = data.utterances[i].intent
    //intentの位置をINTENTS配列から探し出して、INTENTS_COUNT配列の同じ位置に1加算
    INTENTS_COUNT[$.inArray(intent, INTENTS_NAME)] += 1;

    //entityは複数含まれるのでfor文で回してそれぞれについて加算する。
    for(j=0; j<data.utterances[i].entities.length; j++)
    {
      var entity = data.utterances[i].entities[j].entity
      ENTITIES_COUNT[$.inArray(entity, ENTITIES_NAME)] += 1;
    }
  }

  setEachValue();
  drawIntentChart();
  drawEntityChart();
}

function setEachValue()
{
  document.getElementById("intentCount").innerHTML=ALL_INTENT_COUNT;
  document.getElementById("entityCount").innerHTML=ALL_ENTITY_COUNT;
  document.getElementById("prebuiltEntityCount").innerHTML=ALL_PREBUILT_ENTITY_COUNT;
  document.getElementById("labeledUtterancesCount").innerHTML=ALL_LBELED_UTTERANCES_COUNT;
  $('#loader-bg').delay(300).fadeOut(600);
  $('#loader').delay(300).fadeOut(600);
  $('#container').css({"visibility":" visible"});
  $('#wrap').css('display', 'block');
}



function drawIntentChart(data)
{
  var ctx = document.getElementById("intentChart");
  var data = {
    labels: INTENTS_NAME,
    datasets: [
        {
            data: INTENTS_COUNT,
            backgroundColor: DEFAULT_COLORS,
        }]
  };
  var options = {
    animation:{
            animateScale:true
        }
  }
  var myPieChart = new Chart(ctx,{
    type: 'pie',
    data: data,
    options: options
  });
}

function drawEntityChart(data)
{
  var ctx = document.getElementById("entityChart");
  var data = {
    labels: ENTITIES_NAME,
    datasets: [
        {
            label:"Entity Breakdown",
            data: ENTITIES_COUNT,
            backgroundColor: DEFAULT_COLORS,
            borderColor: DEFAULT_COLORS,
        }]
  };
  var options = {
    animation:{
            animateScale:true
        }
  }
  var myBarChart = new Chart(ctx,{
    type: 'bar',
    data: data,
    options: options
  });
}