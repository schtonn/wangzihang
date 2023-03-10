function toggleHide() {
    $(".hidable").toggle();
};

AV.init({
    appId: "BmologYYnRqCv0SLHDeDdA17-gzGzoHsz",
    appKey: "w9mVebFMdCmY6Nh9vfcBGaGt",
    serverURL: "https://bmologyy.lc-cn-n1-shared.com/",
});

console.log("温馨提示：*成绩*一定不会上传到网络，但为了保证使用范围，可能会对其他信息进行记录。")

function decimal(x, n) {
    x = Math.round(x * 10 ** n) / 10 ** n;
    return x.toFixed(n);
}
var fileCount = 0, cur = 0, files = {};

function prevFile() {
    cur = (cur - 1 + fileCount) % fileCount;
    processFiles();
}

function nextFile() {
    cur = (cur + 1) % fileCount;
    processFiles();
}

function clearScreen() {
    $(".chart").hide()
    $("#fileOutput")[0].innerHTML = "";
    $("#fileInfo")[0].innerHTML = "";
    $("#name")[0].innerHTML = "";
}



document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e) {
        if (e.key == "ArrowLeft") {
            prevFile();
        }
        else if (e.key == "ArrowRight") {
            nextFile();
        } else if ('1' <= e.key && e.key <= '9') {
            if (parseInt(e.key) <= fileCount) {
                cur = parseInt(e.key) - 1;
                processFiles();
            }
        }
    }
};

function getFiles(event) {
    files[fileCount] = event.target.files[0];
    cur = fileCount;
    fileCount++;
    $("#controls").removeClass("disabled");
    $("#lbtn").removeClass("disabled");
    $("#rbtn").removeClass("disabled");
    processFiles(1);
}

const key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
function aesDecrypt(encrypted) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
    var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(encrypted) })
    var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}


function processFiles(isFirstTime = 0) {
    console.log("Start processing No. " + cur);
    var file = files[cur];
    var message = $("#message")[0];
    var upBtn = $("#upbtn")[0];
    var upIcon = $("#upicon")[0];
    var tableLayout = '<table class="table table-responsive" style="table-layout: fixed;">'
    message.innerHTML = (cur + 1) + "/" + (fileCount) + " - " + file.name + " - " + file.size + " 字节 - " + file.type + " - 正在读取...<br>>";
    upBtn.classList.remove('btn-danger');
    upBtn.classList.add('btn-info');
    upIcon.classList.remove('glyphicon-exclamation-sign');
    upIcon.classList.add('glyphicon-open');

    var reader = new FileReader();
    var content = "";
    reader.onload = function (event) {
        try {

            var output = $("#fileOutput")[0];
            var info = $("#fileInfo")[0];
            var name = $("#name")[0];
            var object = eval("(" + event.target.result + ")");
            var classText = "", gradingText = "";

            object.data = eval("(" + aesDecrypt(object.data).toString() + ")");

            var seIds = [], seNames = [], iter = 1;
            var datSingle = object.data.multiExamStudentScore.singleExamStudentScores, datClass = object.data.singleExamClassScores, datYs = object.data.singleExamClassYsScores, datMulti = object.data.multiExam.singleExams;
            seIds = object.data.seIds;
            for (var i = 0; i < seIds.length; i++) {
                console.log(datMulti[i].seId)
                for (var j = 0; j < seIds.length; j++) {
                    if (datMulti[i].seId == seIds[j]) {
                        seNames[j] = datMulti[i].seCourseName;
                    }
                }
            }
            console.log(seIds)
            console.log(seNames)
            var seNameDic = {};
            for (var i = 0; i < seIds.length; i++) {
                seNameDic[seIds[i]] = seNames[i];
            }
            seNameDic["0"] = "总分";
            for (var i = 0; i < datYs.length; i++) {
                seNameDic[datYs[i].seId + "Ys"] = seNameDic[datYs[i].seId] + " " + datYs[i].ysClassId;
            }
            console.log(seNameDic)
            var seIdDic = {}, seIdRev = {};
            for (var i = 0; i < seIds.length; i++) {
                for (var j = 0; j < seIds.length; j++) {
                    if (datSingle[j].seId == seIds[i]) {
                        seIdDic[j] = i;
                    }
                }
            }
            for (var i = 0; i < seIds.length; i++)seIdRev[seIdDic[i]] = i;
            var scoreP = {}, avgP = {}, rate0 = {}, rate25 = {}, rate50 = {}, rate75 = {}, rate100 = {}, rateFull = {};//表1用
            var classOrderP = {}, ysClassOrderP = {}, gradeOrderP = {};
            var classOrder = {}, ysClassOrder = {}, gradeOrder = {};
            for (var i = 0; i < seIds.length; i++) {
                var dId = datSingle[i].seId;
                scoreP[dId] = datSingle[i].essScore;
                avgP[dId] = datClass[i].secsAvgScore;
                rate0[dId] = datClass[i].secsMinScore;
                rate25[dId] = datClass[i].secsQuarterScore;
                rate50[dId] = datClass[i].secsHalfScore;
                rate75[dId] = datClass[i].secs3quatrerScore;
                rate100[dId] = datClass[i].secsMaxScore;
                rateFull[dId] = datMulti[seIdDic[i]].seFullScore;
                // scoreRate[dId] = decimal(datSingle[i].essScore / datMulti[seIdDic[i]].seFullScore, 3);
                classOrderP[dId] = datSingle[i].essClassOrder;
                gradeOrderP[dId] = datSingle[i].essGradeOrder;
                classOrder[dId] = decimal(1 - datSingle[i].essClassOrder / datClass[i].secsStudentCount, 3);
                gradeOrder[dId] = decimal(1 - datSingle[i].essGradeOrder / datMulti[seIdDic[i]].seStudentCount, 3);
            }
            // scoreRate["0"] = decimal(object.data.multiExamStudentScore.messScore / object.data.multiExam.meFullScore, 3);
            // classOrder["0"] = decimal(1 - object.data.multiExamStudentScore.messClassOrder / object.data.multiExamClassScores[0].mecsStudentCount, 3); + "<br>"
            // gradeOrder["0"] = decimal(1 - object.data.multiExamStudentScore.messGradeOrder / object.data.multiExamSchoolScore.mecsStudentCount, 3); + "<br>"
            classOrderP["0"] = object.data.multiExamStudentScore.messClassOrder;
            gradeOrderP["0"] = object.data.multiExamStudentScore.messGradeOrder
            for (var i = 0; i < datYs.length; i++) {
                for (var j = 0; j < seIds.length; j++) {
                    if (datYs[i].seId == datSingle[j].seId) {
                        ysClassOrder[datYs[i].seId + "Ys"] = decimal(1 - datSingle[j].essYsClassOrder / datYs[i].secsStudentCount, 3);
                        ysClassOrderP[datYs[i].seId + "Ys"] = datSingle[j].essYsClassOrder;
                    }
                }
            }

            for (var i = 0; i < seIds.length; i++) {
                // object.data.multiExamStudentScore.singleExamStudentScores[i].seId    ---datSingle
                // object.data.singleExamClassScores[i].seId                            ---datClass
                // object.data.multiExam.singleExams[i].seId                            ---datMulti
                // seIds[i]
                // 前两个和后两个数据应该是能分别对上号的（1-2 3-4），用 seIdDic 连接
                // seIdDic {key(1-2): value(3-4),..}
                var g = seIdRev[i];
                classText += "<h4>"
                    + seNameDic[datSingle[g].seId] + "</h4>"
                    + "<b>单科分数：" + datSingle[g].essScore + "</b><br><br>"
                    + "单科分数班级排名：" + datSingle[g].essClassOrder + "<br>"
                    + "单科班级参考人数：" + datClass[g].secsStudentCount + "<br>"
                    + "单科班级年级排名：" + datClass[g].secsClassOrder + "<br>"
                    + "单科班级："
                    + tableLayout + '<tr><td>平均分</td><td>最高分</td><td>四分位数（75%）</td><td>中位数</td><td>四分位数（25%）</td><td>最低分</td></tr>'
                    + "<tr><td>" + datClass[g].secsAvgScore + "</td><td>" + datClass[g].secsMaxScore + "</td><td>" + datClass[g].secs3quatrerScore + "</td><td>" + datClass[g].secsHalfScore + "</td><td>" + datClass[g].secsQuarterScore + "</td><td>" + datClass[g].secsMinScore + "</td></tr></table>";
                for (var j = 0; j < datYs.length; j++) {
                    if (datYs[j].seId == datSingle[g].seId) {
                        classText += "<br><br>"
                            + "单科分层班级名称：" + datYs[j].ysClassId + "<br>"
                            + "单科分数分层班级排名：" + datSingle[g].essYsClassOrder + "<br>"
                            + "单科分层班级参考人数：" + datYs[j].secsStudentCount + "<br>"
                            + "单科分层班级年级排名：" + datYs[j].secsClassOrder + "<br>"
                            + "单科分层班级："
                            + tableLayout + '<tr><td>平均分</td><td>最高分</td><td>四分位数（75%）</td><td>中位数</td><td>四分位数（25%）</td><td>最低分</td></tr>'
                            + "<tr><td>" + datYs[j].secsAvgScore + "</td><td>" + datYs[j].secsMaxScore + "</td><td>" + datYs[j].secs3quatrerScore + "</td><td>" + datYs[j].secsHalfScore + "</td><td>" + datYs[j].secsQuarterScore + "</td><td>" + datYs[j].secsMinScore + "</td></tr></table>";
                    }
                }
                classText += "<br><br>"
                    + "单科分数年级排名：" + datSingle[g].essGradeOrder + "<br>"
                    + "单科年级参考人数：" + datMulti[seIdDic[g]].seStudentCount + "<br>"
                    + "单科年级："
                    + tableLayout + '<tr><td>平均分</td><td>最高分</td><td>四分位数（75%）</td><td>中位数</td><td>四分位数（25%）</td><td>最低分</td></tr>'
                    + "<tr><td>" + datMulti[seIdDic[g]].seAvgScore + "</td><td>" + datMulti[seIdDic[g]].seMaxScore + "</td><td>" + datMulti[seIdDic[g]].se3QuarterScore + "</td><td>" + datMulti[seIdDic[g]].seHalfScore + "</td><td>" + datMulti[seIdDic[g]].seQuarterScore + "</td><td>" + datMulti[seIdDic[g]].seMinScore + "</td></tr></table><br><br>";
            }

        } catch (e) {
            console.log(e);
            clearScreen();
            message.innerHTML += "读取失败！";
            upBtn.classList.remove('btn-info');
            upBtn.classList.add('btn-danger');
            upIcon.classList.remove('glyphicon-open');
            upIcon.classList.add('glyphicon-exclamation-sign');
            return;
        }
        // sheetOutput("各科得分比例一览表", scoreRate);
        // sheetOutput("各科班级排名一览表", classOrder);
        // sheetOutput("各科分层班级排名一览表", ysClassOrder);
        // sheetOutput("各科年级排名一览表", gradeOrder);
        if (isFirstTime) {
            const up = AV.Object.extend('Score');
            const upload = new up();
            upload.set('name', object.data.multiExamStudentScore.studentName);
            upload.set('classId', parseInt(object.data.examStudents[0].classId));
            upload.save().then((upload) => {
                console.log("success" + upload);
            });
        }
        message.innerHTML += "读取成功！"
            + " - 注：实验中学 74 桌出品，我仅做搬运修改。<br>";
        name.innerHTML = "姓名：" + object.data.multiExamStudentScore.studentName;
        info.innerHTML = "<h3>" + object.data.multiExam.meName + "</h3>"
            + "行政班级：" + object.data.examStudents[0].classId + "<br>"
            + "姓名：" + object.data.multiExamStudentScore.studentName + "<br>";
        output.innerHTML = "<br><h4>总分</h4>"
            + "<b>全科分数：" + object.data.multiExamStudentScore.messScore + "</b><br><br>"
            + "全科分数班级排名：" + object.data.multiExamStudentScore.messClassOrder + "<br>"
            + "全科班级参考人数：" + object.data.multiExamClassScores[0].mecsStudentCount + "<br>"
            + "全科班级年级排名：" + object.data.multiExamClassScores[0].mecsClassOrder + "<br>"
            + "全科班级："
            + tableLayout + '<tr><td>平均分</td><td>最高分</td><td>四分位数（75%）</td><td>中位数</td><td>四分位数（25%）</td><td>最低分</td></tr>'
            + "<tr><td>" + object.data.multiExamClassScores[0].mecsAvgScore + "</td><td>" + object.data.multiExamClassScores[0].mecsMaxScore + "</td><td>" + object.data.multiExamClassScores[0].mecs3quatrerScore + "</td><td>" + object.data.multiExamClassScores[0].mecsHalfScore + "</td><td>" + object.data.multiExamClassScores[0].mecsQuarterScore + "</td><td>" + object.data.multiExamClassScores[0].mecsMinScore + "</td></tr></table>"
            + "<br><br>全科分数年级排名：" + object.data.multiExamStudentScore.messGradeOrder + "<br>"
            + "全科年级参考人数：" + object.data.multiExamSchoolScore.mecsStudentCount + "<br>"
            + "全科年级："
            + tableLayout + '<tr><td>平均分</td><td>最高分</td><td>四分位数（75%）</td><td>中位数</td><td>四分位数（25%）</td><td>最低分</td></tr>'
            + "<tr><td>" + object.data.multiExam.meAvgScore + "</td><td>" + object.data.multiExam.meMaxScore + "</td><td>" + object.data.multiExam.me3QuatrerScore + "</td><td>" + object.data.multiExam.meHalfScore + "</td><td>" + object.data.multiExam.meQuarterScore + "</td><td>" + object.data.multiExam.meMinScore + "</td></tr></table><br><br>"
            + classText;


        $("#fileOutput table").css("display", "inline-table");
        $("#fileOutput table").css("margin-bottom", "0px");

        $('.chart').show();

        sChart1 = echarts.init($("#score1")[0]);
        sChart2 = echarts.init($("#score2")[0]);
        oChart1 = echarts.init($("#order1")[0]);
        oChart2 = echarts.init($("#order2")[0]);
        oChart3 = echarts.init($("#order3")[0]);
        oChart4 = echarts.init($("#order4")[0]);


        seNameDicP = []; scorePP = []; avgPP = []; rate0P = []; rate25P = []; rate50P = []; rate75P = []; rate100P = []; rateFullP = [];
        scoreQ = []; avgQ = []; rate0Q = []; rate25Q = []; rate50Q = []; rate75Q = []; rate100Q = [];
        seNameDicP2 = []; classOrderPP = []; gradeOrderPP = []; classOrderQ = []; gradeOrderQ = [];
        seNameDicP3 = []; ysClassOrderPP = []; ysClassOrderQ = [];
        console.log(scoreP)
        for (var i = 0; i < seIds.length; i++) {
            var g = seIds[i];
            if (seNameDic[g].substr(0, 2) == '总分') continue;
            seNameDicP.push(seNameDic[g].substr(0, 2));
            scorePP.push(scoreP[g]);
            avgPP.push(avgP[g]);
            rate0P.push(rate0[g]);
            rate25P.push(rate25[g]);
            rate50P.push(rate50[g]);
            rate75P.push(rate75[g]);
            rate100P.push(rate100[g]);
            rateFullP.push(rateFull[g]);
            scoreQ.push(decimal(scoreP[g] / rateFull[g] * 100, 1));
            avgQ.push(decimal(avgP[g] / rateFull[g] * 100, 1));
            rate0Q.push(decimal(rate0[g] / rateFull[g] * 100, 1));
            rate25Q.push(decimal(rate25[g] / rateFull[g] * 100, 1));
            rate50Q.push(decimal(rate50[g] / rateFull[g] * 100, 1));
            rate75Q.push(decimal(rate75[g] / rateFull[g] * 100, 1));
            rate100Q.push(decimal(rate100[g] / rateFull[g] * 100, 1));
        }
        for (var i = 0; i < seIds.length; i++) {
            var g = seIds[i];
            seNameDicP2.push(seNameDic[g].substr(0, 2));
            classOrderPP.push(classOrderP[g]);
            gradeOrderPP.push(gradeOrderP[g]);
            classOrderQ.push(decimal(classOrder[g] * 100, 1));
            gradeOrderQ.push(decimal(gradeOrder[g] * 100, 1));
        }
        for (var i in ysClassOrderP) {
            seNameDicP3.push(seNameDic[i]);
            ysClassOrderPP.push(ysClassOrderP[i]);
            ysClassOrderQ.push(decimal(ysClassOrder[i] * 100, 1));
        }
        var sOp1 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            },
            title: {
                text: '分数',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['0%', '25%', '50%', '75%', '100%', '满分', '平均分', '我的分数']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category', data: seNameDicP,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value', name: '分数', position: 'left'
            }],
            series: [{
                name: '0%', type: 'line', data: rate0P, color: '#5cb85c'
            }, {
                name: '25%', type: 'line', data: rate25P, color: '#c7dc68'
            }, {
                name: '50%', type: 'line', data: rate50P, color: '#c7dc68'
            }, {
                name: '75%', type: 'line', data: rate75P, color: '#c7dc68'
            }, {
                name: '100%', type: 'line', data: rate100P, color: '#5cb85c'
            }, {
                name: '满分', type: 'line', data: rateFullP, color: '#f0ad4e'
            }, {
                name: '平均分', type: 'line', data: avgPP, color: '#337ab7'
            }, {
                name: '我的分数', type: 'line', data: scorePP, color: '#e2041b'
            }],
        };
        var sOp2 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            },
            title: {
                text: '得分率',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['0%', '25%', '50%', '75%', '100%', '平均得分率', '我的得分率']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category',

                data: seNameDicP,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value',
                name: '得分率(%)',
                position: 'left'
            }],
            series: [{
                name: '0%', type: 'line', data: rate0Q, color: '#5cb85c'
            }, {
                name: '25%', type: 'line', data: rate25Q, color: '#c7dc68'
            }, {
                name: '50%', type: 'line', data: rate50Q, color: '#c7dc68'
            }, {
                name: '75%', type: 'line', data: rate75Q, color: '#c7dc68'
            }, {
                name: '100%', type: 'line', data: rate100Q, color: '#5cb85c'
            }, {
                name: '平均得分率', type: 'line', data: avgQ, color: '#337ab7'
            }, {
                name: '我的得分率', type: 'line', data: scoreQ, color: '#d9534f'
            }

            ]
        };

        var oOp1 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            }, title: {
                text: '行政排名位次',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['班级排名', '年级排名']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category', data: seNameDicP2,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value',
                name: '排名',
                position: 'left'
            }],
            series: [{
                name: '班级排名', type: 'bar', data: classOrderPP, color: '#5bc0de'
            }, {
                name: '年级排名', type: 'bar', data: gradeOrderPP, color: '#337ab7'
            }
            ]
        };

        var oOp2 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            }, title: {
                text: '行政排名比例',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['班级排名(%)', '年级排名(%)']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category', data: seNameDicP2,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value',
                name: '排名(%)',
                position: 'left'
            }],
            series: [{
                name: '班级排名(%)', type: 'bar', data: classOrderQ, color: '#5bc0de'
            }, {
                name: '年级排名(%)', type: 'bar', data: gradeOrderQ, color: '#337ab7'
            }
            ]
        };

        var oOp3 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            }, title: {
                text: '分班排名位次',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['分班排名']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category', data: seNameDicP3,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value',
                name: '排名',
                position: 'left'
            }],
            series: [{
                name: '分班排名', type: 'bar', data: ysClassOrderPP, color: '#5cb85c'
            }
            ]
        };

        var oOp4 = {
            textStyle: {
                fontFamily: 'Noto Serif SC'
            }, title: {
                text: '分班排名比例',
                textStyle: {
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['分班排名(%)']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    }
                },
                padding: 25,
                orient: 'vertical'
            },
            calculable: true,
            xAxis: [{
                type: 'category', data: seNameDicP3,
                name: '科目',
                position: 'left'
            }],
            yAxis: [{
                type: 'value',
                name: '排名(%)',
                position: 'left'
            }],
            series: [{
                name: '分班排名(%)', type: 'bar', data: ysClassOrderQ, color: '#5cb85c'
            }
            ]
        };

        // 为echarts对象加载数据 
        sChart1.setOption(sOp1);
        sChart2.setOption(sOp2);
        oChart1.setOption(oOp1);
        oChart2.setOption(oOp2);
        oChart3.setOption(oOp3);
        oChart4.setOption(oOp4);
    }
    reader.readAsText(file);
}

$().ready(function () {
    $(".chart").hide()
})