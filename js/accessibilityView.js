define([
    'coreJS/adapt'
], function(Adapt) {

    var cookie = (function cookie(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var r in t)n[r]=t[r]}return n}function n(t){function r(n,o,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if(i=e({path:"/"},r.defaults,i),"number"==typeof i.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}try{c=JSON.stringify(o),/^[\{\[]/.test(c)&&(o=c)}catch(s){}return o=t.write?t.write(o,n):encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",o,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],u=/(%[0-9A-Z]{2})+/g,d=0;d<p.length;d++){var f=p[d].split("="),l=f[0].replace(u,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(u,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(s){}if(n===l){c=m;break}n||(c[l]=m)}catch(s){}}return c}}return r.set=r,r.get=function(e){return r(e)},r.getJSON=function(){return r.apply({json:!0},[].slice.call(arguments))},r.defaults={},r.remove=function(n,t){r(n,"",e(t,{expires:-1}))},r.withConverter=n,r}return n(function(){})})();

    var AccessibilityView = Backbone.View.extend({

        el: '#accessibility-toggle',

        initialize: function() {
            this.setupHelpers();

            var settings = this.getStoredSettings();
            Adapt.config.get("_accessibility")._isActive = settings.a11y || false;
            
            this.configureAccessibility();
            this.setupUsageInstructions();

            this.render();
        },

        getStoredSettings: function() {
            var str = cookie.get("_languagePicker") || "{}";
            var settings = JSON.parse(str);
            return settings;
        },

        setStoredSettings: function(settings) {
            var str = JSON.stringify(settings);
            cookie.set("_languagePicker", str);
        },

        events: {
            'click' : 'toggleAccessibility'
        },

        render: function() {
            var hasAccessibility = Adapt.config.has('_accessibility')
                && Adapt.config.get('_accessibility')._isEnabled;

            if (!hasAccessibility) {
                return;
            } else {
                var isActive = Adapt.config.get('_accessibility')._isActive;
                var offLabel = this.model.get("_accessibility") && this.model.get("_accessibility")._accessibilityToggleTextOff;
                var onLabel = this.model.get("_accessibility") && this.model.get("_accessibility")._accessibilityToggleTextOn;

                var toggleText = isActive ? offLabel : onLabel;

                this.$el.html(toggleText);

                if (isActive) {
                    $("html").addClass('accessibility');
                    $("#accessibility-instructions").a11y_focus();
                } else {
                    $("html").removeClass('accessibility');
                }
            }
        },

        toggleAccessibility: function(event) {
            event.preventDefault();

            var hasAccessibility = Adapt.config.get('_accessibility')._isActive;

            var toggleAccessibility = (hasAccessibility) ? false : true;

            Adapt.config.get('_accessibility')._isActive = toggleAccessibility;

            Adapt.trigger('languagepicker:accessibility:toggle');

            this.configureAccessibility();
            this.setupUsageInstructions();

            this.render();           
            
            window.location.reload();
        },

        setupHelpers: function() {
            var config = Adapt.config.get("_accessibility");

            Handlebars.registerHelper('a11y_text', function(text) {
                //ALLOW ENABLE/DISABLE OF a11y_text HELPER
                if (config && config._isTextProcessorEnabled === false) {
                    return text;
                } else {
                    return $.a11y_text(text);
                }
            });
        },

        configureAccessibility: function() {

            var isActive = Adapt.config.get('_accessibility')._isActive;

            if (!Modernizr.touch) {
                var settings = {
                    a11y: Adapt.config.get("_accessibility")._isActive
                };
                this.setStoredSettings(settings);
                Adapt.offlineStorage.set("a11y", settings.a11y);
            }

            if (isActive) {

                _.extend($.a11y.options, {
                    isTabbableTextEnabled: true,
                    isUserInputControlEnabled: true,
                    isFocusControlEnabled: true,
                    isFocusLimited: true,
                    isRemoveNotAccessiblesEnabled: true,
                    isAriaLabelFixEnabled: true,
                    isFocusWrapEnabled: true,
                    isScrollDisableEnabled: true,
                    isScrollDisabledOnPopupEnabled: false,
                    isSelectedAlertsEnabled: true,
                    isAlertsEnabled: true
                });
            } else {
                _.extend($.a11y.options, {
                    isTabbableTextEnabled: false,
                    isUserInputControlEnabled: true,
                    isFocusControlEnabled: true,
                    isFocusLimited: false,
                    isRemoveNotAccessiblesEnabled: true,
                    isAriaLabelFixEnabled: true,
                    isFocusWrapEnabled: true,
                    isScrollDisableEnabled: true,
                    isScrollDisabledOnPopupEnabled: false,
                    isSelectedAlertsEnabled: false,
                    isAlertsEnabled: false
                });
            }

            $.a11y.ready();
        },

        setupUsageInstructions: function() {
            if (!this.model.get("_accessibility") || !this.model.get("_accessibility")._accessibilityInstructions) {
                $("#accessibility-instructions").remove();
                return;
            }

            var instructionsList =  this.model.get("_accessibility")._accessibilityInstructions;

            var usageInstructions;
            if (instructionsList[Adapt.device.browser]) {
                usageInstructions = instructionsList[Adapt.device.browser];
            } else if (Modernizr.touch) {
                usageInstructions = instructionsList.touch || "";
            } else {
                usageInstructions = instructionsList.notouch || "";
            }

           $("#accessibility-instructions").html( usageInstructions );
        }

    });

    return AccessibilityView;

});
