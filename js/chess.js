AV.init({
    appId: "BmologYYnRqCv0SLHDeDdA17-gzGzoHsz",
    appKey: "w9mVebFMdCmY6Nh9vfcBGaGt",
    serverURL: "https://bmologyy.lc-cn-n1-shared.com",
});

$(window).on({
    contextmenu: function () {
        return false;
    },
    dragstart: function () {
        return false;
    },
    beforeunload: function () {
        return true;
    }
})

var curCol = 0, myCol = -1, cur;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    myCol = parseInt(getCookie('color'))
    if (myCol != 0 && myCol != 1) myCol = -1;
    console.log('mycolor: ' + myCol)
}

function updateLight() {
    if (curCol) {
        $('.light').removeClass("black");
        $('.light').addClass("white");
    } else {
        $('.light').removeClass("white");
        $('.light').addClass("black");
    }
}

function updateCol() {
    updateLight();
    if (curCol) {
        $('.pointer').removeClass("black");
        $('.pointer').addClass("white");
    } else {
        $('.pointer').removeClass("white");
        $('.pointer').addClass("black");
    }
}
class Chess {
    constructor(ele) {
        this.ele = ele;
        this.init();
    }
    init() {
        this.arr = [];
        this.render();
        $('.pointer')[0].style.display = 'block'
        $('.pointer').animate({
            left: $('#game')[0].offsetLeft - 50,
            top: $('#game')[0].offsetTop + 30,
        }, 0);
        $('.pos').on('mouseenter', function () {
            if ($(this).hasClass("black") || $(this).hasClass("white") || (myCol != -1 && myCol != curCol)) return;
            document.onmousemove = null
            $('.pointer').animate({
                left: this.parentNode.parentNode.parentNode.parentNode.offsetLeft + this.parentNode.offsetLeft + 3,
                top: this.parentNode.parentNode.parentNode.parentNode.offsetTop + this.parentNode.offsetTop + 3,
                opacity: 0.7,
            }, 0)
            $('.pointer')[0].style.boxShadow = '3px 3px 7px rgba(15,15,15,0.5)'
            $('.pointer')[0].style.transform = 'scale(100%)'
        })
        $('.pos').mouseleave(function (e) {
            updateCol();
            document.onmousemove = function (e) {
                $('.pointer').animate({
                    left: e.pageX - 14,
                    top: e.pageY - 14,
                    opacity: 0.3,
                    scale: 1
                }, 0)
            }
            $('.pointer')[0].style.boxShadow = ''
            $('.pointer')[0].style.transform = ''
        })
        this.span = $("#tbodys span");
        let that = this
        $("#tbodys").on('click', 'tr td span', function () {
            that.click(this);
        });
        $("#regret").on('click', function () {
            that.regret();
        })
        $("#agin").on('click', function () {
            that.agin();
        })
    }
    render() {
        let div = $("<div id='xq-tips'>").appendTo($(this.ele))
        $("<div class='xq-txt'>").appendTo($(div))
        let table2 = $("<table><tbody id='tbodys'>").addClass("tables").attr("border", "0").appendTo($(this.ele));
        for (let i = 0; i < 16; i++) {
            let tr2 = $("<tr>").appendTo($("#tbodys"));
            for (let j = 0; j < 16; j++) {
                $("<td><span class='pos' id=" + (i * 16 + j) + ">").appendTo($(tr2));
            }
        }
    }
    click(_this) {
        console.log(_this)
        this.ifs(_this)
        this.win();
    }
    upd() {
        $(this.span).each((index, item) => {
            this.arr.forEach((arrItem, arrIndex) => {
                if (index == arrItem) {
                    if (arrIndex % 2 == 0) $(item).addClass("black");
                    else $(item).addClass("white");
                }
            })
        })
        let num = this.arr.length;
        curCol = num % 2;
        updateLight();
    }
    ifs(_this) {
        if (myCol == -1) {
            myCol = curCol;
            setCookie('color', myCol, 1)
        }
        if ($(_this).hasClass("black") || $(_this).hasClass("white") || myCol != curCol) return;
        myCol = curCol;
        let num = this.arr.length;
        console.log(this.arr)
        $(this.span).each((index, item) => {
            if (item === _this) {
                this.arr.push(index);
                this.nums = index
                curCol = (num + 1) % 2;
                updateLight();
                if (num % 2 == 0) {
                    $(_this).addClass("black");
                }
                else {
                    $(_this).addClass("white");
                }
                return;
            }
        })
        cur.set('data', this.arr)
        cur.save();
    }
    win() {
        let this_ = this;
        let brr = [], wrr = [];
        $(this_.arr).each((index, item) => {
            if ($(this_.span[item]).hasClass("black")) {
                brr.push(item);
            }
            else {
                wrr.push(item);
            }
        })
        brr = brr.sort(function (a, b) {
            return a - b;
        })
        wrr = wrr.sort(function (a, b) {
            return a - b;
        })
        if (this.isInclude(brr, 1) || this.isInclude(brr, 16) || this.isInclude(brr, 17) || this.isInclude(brr, 15)) {
            this.arr = [];
            $("#xq-tips").show();
            $(".xq-txt").html("Black Wins!");
            $("#regret").hide();
        }
        if (this.isInclude(wrr, 1) || this.isInclude(wrr, 16) || this.isInclude(wrr, 17) || this.isInclude(wrr, 15)) {
            this.arr = [];
            $("#xq-tips").show();
            $(".xq-txt").html("White Wins!");
            $("#regret").hide();
        }
    }
    isInclude(brr, x) {
        for (let i = 0; i < brr.length; i++) {
            if (brr.includes(brr[i]) && brr.includes(brr[i] + x * 1) && brr.includes(brr[i] + x * 2) && brr.includes(brr[i] + x * 3) && brr.includes(brr[i] + x * 4)) {
                return true;
            }
        }
    }
    regret() {
        if (this.arr.length == 0 || curCol == myCol) {
            return false;
        }
        let len = this.arr.length - 1;
        let num = this.arr[len]
        $(this.span[num]).removeClass("black white");
        curCol = num % 2;
        updateCol();
        this.arr.pop();
        cur.set('data', this.arr)
        cur.save();
    }
    reset() {
        this.arr = [];
        for (let i = 0; i < this.span.length; i++) {
            $(this.span[i]).removeClass("black white");
        }
    }
    agin() {
        $('.pointer').removeClass("white");
        $('.pointer').addClass("black");
        checkCookie();
        var exp = new Date();
        exp.setTime(exp.getTime() - 1)
        setCookie('color', myCol, exp)
        myCol = -1;
        this.reset();
        $("#xq-tips").hide();
        $(".xq-txt").html("");
        $("#regret").show();
        cur.set('data', this.arr)
        cur.save();
    }

}
var game;

checkCookie();

const query = new AV.Query('chess');
query.descending('updatedAt')
query.limit(1)
query.find().then((result) => {
    $("#begin").hide();
    $("#regret").show();
    $("#agin").show();
    $("#game").show();
    if (result.length) {
        console.log('Data loaded from LeanCloud')
        cur = result[0]
        var map = result[0].get('data')
        console.log(map)
        if (map.length) {
            game = new Chess($("#game"));
            game.arr = map;
            game.upd();
            updateCol();
        } else {
            game = new Chess($("#game"));
        }
    }
})


query.subscribe().then((liveQuery) => {
    console.log('Subscribed')
    liveQuery.on('update', (result) => {
        var map = result.get('data')
        console.log(map);
        game.reset();
        game.arr = map;
        game.upd();
        curCol = map.length % 2;
        if (map.length) {
            game.win()
        } else {
            $('.pointer').removeClass("white");
            $('.pointer').addClass("black");
            checkCookie();
            var exp = new Date();
            exp.setTime(exp.getTime() - 1)
            setCookie('color', myCol, exp)
            myCol = -1;
            $("#xq-tips").hide();
            $(".xq-txt").html("");
            $("#regret").show();
        }
    });
});
