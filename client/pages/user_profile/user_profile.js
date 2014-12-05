'use strict';
$(function () {
    setEvents();
    multiselect();
});

var service_heading_map = {
    //service value in db and div id in html: service heading id in html
    "catering"        : "#catering_head",
    "photography"     : "#photography_head",
    "videography"     : "#videography_head",
    "streaming"       : "#streaming_head",
    "bridal_makeup"   : "#bridal_makeup_head",
    "jewellery"       : "#jewellery_head",
    "bridal_wear"     : "#bridal_wear_head",
    "designer_wear"   : "#designer_wear_head",
    "cosmetics"       : "#cosmetics_head",
    "cards"           : "#cards_head",
    "travel"          : "#travel_head",
    "accessories"     : "#accessories_head",
    "venue"           : "#venue_head",
    "event_management": "#event_management_head"
};

function setEvents() {
    //When each services heading is clicked, toggle that service's block
    $.each(service_heading_map, function (service, head_id) {
        $(head_id).click(function () {
            $("#" + service).toggle();
        });
    });

    //on click on next button, go to next tab
    var $tabs = $('#myTab li');

    $('#btn_proceed_from_profile_entry, #btn_proceed_from_service_prov, #btn_proceed_from_gallery')
        .on('click', function(e) {
        //alert($tabs.filter('.active').next('li').find('a[data-toggle="tab"]').prop('href'));
        $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
        e.preventDefault();
        $(window).scrollTop(0);
    });
    //save profile on click of save profile button
    $("#btn_proceed_from_bank").click(saveProfile);

    //before switching to next tab, validate current tab's form
    /*$('#myTab a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var currentTab = e.relatedTarget.toString().split('#')[1];
        //var nextTab = e.target.toString().split('#')[1];
        //alert("currentTab:"+currentTab+"\n\n"+"nextTab:"+nextTab);
        var formId = $("#" + currentTab + " form").prop("id");
        if (formId) {
            var lastFormsData = validateModule.showValidateErrors("#" + formId);
            if (lastFormsData) {
                //validation success; save form data in session
                $.post("api/save_in_session", lastFormsData);
            }
            else{
                //validation failed, don't switch tab
                e.preventDefault();
            }
        }
    });*/
}

function multiselect() {
    $('select[name=select_services]').multiselect({
        includeSelectAllOption: true,
        maxHeight             : 200,
        onChange              : function (option, checked) {
            onChange($(option).val(), checked);
        }
    });

    //Trigger onChange for each preselected services
    var selectedValues = $("select[name=select_services]").val();
    if (selectedValues) {
        $.each(selectedValues, function (key, value) {
            onChange(value, true);
        });
    }

    function onChange(service, checked) {
        if (checked) {
            $(service_heading_map[service]).show();
            $("#" + service).show();
        }
        else {
            $(service_heading_map[service]).hide();
            $("#" + service).hide();
        }
    }

    //For name not=select_services and name!=state apply multiselect
    $('select[name!=select_services][name!=state]').multiselect({
        includeSelectAllOption: true,
        maxHeight             : 200
    });
}

function saveProfile(e) {
    $.post("/user_profile_save", $('#bank_form').serialize(), function (saved) {
        if (saved) {
            alert("Saved profile");
        }
        window.location = "/user_profile";
    });
    e.preventDefault();
}

function enableTextbox(e) {
    var value = $("input[name=filled_in_by]:checked").val();
    var agentTextbox = $("#agent_id");
    var isAgent = (value === 'agent');
    agentTextbox.prop("disabled", !isAgent);
    if (isAgent) {
        agentTextbox.focus();
    }
}