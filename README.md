# adapt-contrib-languagePicker  

**Language Picker** is an *extension* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework). It is not yet compatible with the Adapt Authoring Tool.   

**Language Picker** is intended to be used with courses that provide content in more than one language. Prior to entering the course, the learner is presented with a group of buttons. Each button is labelled with a language. Clicking a language button loads content in the chosen language.  

**Language Picker** allows the learner to switch languages while the course is in progress. Clicking the icon in the navigation bar reveals the Language Picker in the [Drawer](https://github.com/adaptlearning/adapt_framework/wiki/Core-modules#drawer).

[Visit the **languagePicker** wiki](https://github.com/adaptlearning/adapt-contrib-languagePicker/wiki) for more information about its functionality and for explanations of key properties.

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/language-picker.gif" alt="" align="center">  

##Installation

As one of Adapt's *[core extensions](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#extensions),* **Language Picker** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation).

* If **Language Picker** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-contrib-languagePicker`

    Alternatively, this extension can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-contrib-languagePicker": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

**Language Picker** is configured in *config.json* with the attributes that follow. The attributes are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-languagePicker/blob/master/example.json).

### Attributes

The following attributes are set within *config.json*.  

**_languagePicker** (object): The languagePicker object that contains values for **_isEnabled**, **displayTitle**, **body**, and **_languages**.

>**_isEnabled** (boolean): Turns the **Language Picker** extension on and off. Acceptable values are `true` and `false`.

>**title** (string): Browser window title text. For example, "Language selection". 

>**displayTitle** (string): Header text. For example, "Please select a language."

>**body** (string): Introductory or explanatory text. For example, "Welcome to ACME Learning. This course is available in several languages. Please make a selection. "

>**_showOnCourseLoad** (boolean): Determines whether the language picker will be displayed on course load. If set to false, the course will load with the default language selected and the user will need to use the icon in the navigation bar to change languages.

>**_languagePickerIconClass** (string): The class defined here will define the icon of the language-picker in the navigation bar. The vanilla theme supports the following class-names by default: "icon-globe", "icon-language-1", "icon-language-2". The default value for this attribute is "icon-language-2".    

>**_languages** (object):  The languages attribute group contains properties related to the available languages.   It contains values for **_language**, **_direction**, **displayName**, **warningTitle**, **warningMessage**, and **_buttons**.  

>>**_language** (string): This text must match the name of the language-specific folder located in the course root, for example, "en" from *course/en*. It is used as the value for the HTML `lang` attribute. It is highly recommended that codes for web languages be used. Reference a source such as the [IANA Language Subtag Registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). 

>>**_direction** (string): Specifies the value of the HTML `dir` attribute and, consequently, the base direction of text. Acceptable values are `"rtl"` (right-to-left) and `"ltr"` (left-to-right). 

>>**displayName** (string): Use this text to identify the full name of the language. This value is used as the button label.  

>>**warningTitle** (string): This text appears as the header of the dialog confirming the learner's intent to change languages, for example, "Change language?".

>>**warningMessage** (string): This text appears as the body of the dialog confirming the learner's intent to change languages, for example, "Changing the language will reset course progress.&lt;br&gt;&lt;br&gt;Would you like to proceed?". 

>>**_buttons** (object): The buttons attribute group stores the label values for the dialog buttons. It contains values for **yes** and **no**.  

>>>**yes** (string): Label for button that confirms the learner's intent to switch languages.

>>>**no** (string): Label for button that cancels the switch languages dialog.   

>**_accessibility** (object):  The accessibility attribute group stores the text of labels employed with [Adapt's accessibility feature](https://github.com/adaptlearning/adapt_framework/wiki/Accessibility). It contains values for **_accessibilityToggleTextOn**, **_accessibilityToggleTextOff**, and **_accessibilityInstructions**.  

>>**accessibilityToggleTextOn** (string): Label to confirm the learner's intent to enable the accessibility feature.  

>>**accessibilityToggleTextOff** (string): Label to confirm the learner's intent to disable the accessibility feature.  

>>**_accessibilityInstructions** (object):  The accessibilityInstructions attribute group stores the text of navigation instructions for various types of devices when [Adapt's accessibility feature](https://github.com/adaptlearning/adapt_framework/wiki/Accessibility) is enabled. It contains values for **touch**, **notouch**, and **ipad**.  

>>>**touch** (string): Instruction text for navigating by gestures.  

>>>**notouch** (string): Instruction text for navigating with the keyboard.  

>>>**ipad** (string): Instruction text for navigating on iPads both by gestures and with the keyboard.

<div float align=right><a href="#top">Back to Top</a></div>



## Limitations
 
- If [**Spoor**](https://github.com/adaptlearning/adapt-contrib-spoor) is disabled, **Language Picker** will not remember the learner's language choice from the previous session. 

- Switching languages will reset course progress in the LMS. 

- Switching languages during an [**Assessment**](https://github.com/adaptlearning/adapt-contrib-assessment) will reset assessment attempts.  

- Language Picker is not yet compatible with the Adapt Authoring Tool.

----------------------------
**Version number:**  1.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a> 
**Framework versions:**  ^2.0.14     
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-bookmarking/graphs/contributors)    
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, IE10, IE9, IE8, IE Mobile 11, Safari for iPhone (iOS 8+9), Safari for iPad (iOS 8+9), Safari 8, Opera  
