$(function () {
    $.getJSON('datasource.json', function (data) {
        var kw = decodeURI(getUrlParam('kw'));
        if(kw && kw!= null && kw!="null"){
            $("#searchKey").val(kw);
            $(".close-del").show();
            getSearch(data, kw);
        }
        if (data != null) {
            var outhtml = template2_setdata($('#template_content').html(), data);
            $('.main-box').html(outhtml);
        }
    });

    $(document).keydown(function(event){
        var kw = document.getElementById("searchKey").value;
        if(kw && kw!= null && kw!="null") {
            if (event.keyCode == 13) {
                goSearch();
            }
        }
    });
});

function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function initClear(){
    var kw = document.getElementById("searchKey").value;
    if(!kw || kw== null || kw=="null"){
        window.location.href = "index.html";
    }
}

function clearSearch(){
    window.location.href = "index.html";
}

function goSearch(){
    var kw = document.getElementById("searchKey").value;
    if(kw && kw!= null && kw!="null"){
        window.location.href = encodeURI(encodeURI("list.html?kw=" + kw));
    } else{
        window.location.href = "index.html";
    }
}

function getSearch(data, kw){
    for(var i in data){
        var newItems = new Array();
        if(!data[i]){
            continue;
        }
        var items = data[i].items;
        for(var j in items){
            var item = items[j];
            if(!item){
                continue;
            }
            if((item.name.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                newItems.push(item);
            }
        }
        data[i].items = newItems;
    }
}