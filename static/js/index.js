$(function () {
    $.getJSON('datasource.json', function (data) {
        var kw = decodeURI(getUrlParam('kw'));
        if(kw && kw!= null && kw!="null"){
            $("#searchKey").val(kw);
            $(".close-del").show();
            getSearch(data, kw);
        }
        if (data != null) {
            // 排序方法
            function jsonSort(a, b) {
                return a.sort - b.sort;
            }
            // 第一层排序
            data = data.sort(jsonSort);
            for (var i = 0; i < data.length; i++) {
                // 第二层排序
                data[i].items = data[i].items.sort(jsonSort);
            }
            // 渲染HTML
            var outhtml = template2_setdata($('#template_content').html(), data);
            $('.main-box').html(outhtml);
        }
    });

    $(document).keyup(function(event){
        var kw = document.getElementById("searchKey").value;
        if(kw && kw!= null && kw!="null") {
            if (event.keyCode == 13) {
                goSearch();
            }
        }
        if(!kw || kw== null || kw=="null"){
            if (event.keyCode == 8) {
                window.location.href = "index.html";
            }
        }
    });
});

function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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
        var jData = data[i];
        if(!jData){
            continue;
        }
        var items = jData.items;
        for(var j in items){
            var item = items[j];
            if(!item){
                continue;
            }
            if((jData.type.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                //匹配分类名称
                newItems.push(item);
            } else if((jData.description.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                //匹配分类详情
                newItems.push(item);
            } else if((item.name.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                //匹配名称
                newItems.push(item);
            } else if((item.url.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                //匹配链接地址
                newItems.push(item);
            } else if((item.description.toLowerCase()).indexOf(kw.toLowerCase()) >-1){
                //匹配详情
                newItems.push(item);
            }
        }
        data[i].items = newItems;
    }
}