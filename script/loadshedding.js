/*
 *  Project:
 *  Description:Loadshedding data using api
 *  Author:Yogendra Paudyal (yogendra.paudyal44@gmail.com)
 *  License:Free
 */
;(function ($,window,undefined) {
    $.setLoadShedding = function (options) {
        options = $.extend(
		{
		    GroupID: 1
		}, options);
        var loadshedding = {
            config: {
                async: false,
                cache: false,
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: 'html',
                baseURL: 'https://acpmasquerade-nepal-loadshedding-schedule-by-sparrow-sms.p.mashape.com/schedule.php',
                headers: {
                    "X-Mashape-Key": "tbZjyrlJT4msh9Cq10iG0fIbWgs3p1DK13GjsnWKltOF8DrJd4",
                },
                groupID: options.GroupID,
                data: {
                    format: 'format=json',
                    group: options.GroupID
                }
            },
            init: function () {
                loadshedding.BindEvents();
                loadshedding.BindLoadShedding();
            },
            ajaxSuccess: function (data) {
                var obj = {};
                var lsdArray = [];
                var rightlsdArray = [];
                var leftlsdArray = [];
                lsdArray = data.split("\n\n");
                leftlsdArray = lsdArray[0].split("\n");
                $.each(leftlsdArray, function (index, item) {
                    var leftlsdChildArray = [];
                    leftlsdChildArray = item.split("-");
                    obj[leftlsdChildArray[0]] = leftlsdChildArray[1];
                });
                rightlsdArray = lsdArray[1].split("\n");
                $.each(rightlsdArray, function (index, item) {
                    var rightlsdChildArray = [];
                    var myshiftArray = [];
                    var myshiftObj = {};
                    rightlsdChildArray = item.split(" ");
                    myshiftArray = rightlsdChildArray[1].split(",");
                    myshiftObj.firstShift = myshiftArray[0];
                    myshiftObj.secondShift = myshiftArray[1];
                    obj[rightlsdChildArray[0]] = myshiftObj;
                });
                var source = $("#loadShedding-template").html();
                var template = Handlebars.compile(source);
                html = template(obj);
                $("#loadShedding-report").html(html);
                $("#ddlLdUsrGrp").val(loadshedding.config.groupID);
				$.unblockUI ();
            },
            ajaxFailure: function () {
				$.unblockUI ();
                alert("Some error on loadshedding modules.");
            },
            ajaxCall: function (config) {
				$.blockUI({message: 'Please Wait....'});
                $.ajax(
				{
				    type: this.config.type,
				    contentType: this.config.contentType,
				    cache: this.config.cache,
				    url: this.config.baseURL,
				    data: this.config.data,
				    dataType: this.config.dataType,
                    headers:this.config.headers,
				    success: this.ajaxSuccess,
				    error: this.ajaxFailure,
				    async: this.config.async
				});
            },
            BindLoadShedding: function () {
                loadshedding.config.data = {
                    format: 'format=json',
                    group: loadshedding.config.groupID
                };
                loadshedding.ajaxCall(loadshedding.config);

            },
            BindEvents: function () {
                $("#loadShedding-report").on("change", "#ddlLdUsrGrp", function () {
                    var selectGrp = $(this).val();
                    loadshedding.config.groupID = selectGrp;
                    loadshedding.BindLoadShedding();
                });
            }
        };
        loadshedding.init();
    }
    $.fn.loadShedding = function (options) {
        $.setLoadShedding(options);
    }
}(jQuery, window));
