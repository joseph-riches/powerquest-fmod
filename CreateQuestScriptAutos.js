studio.menu.addMenuItem({
	name: "Unity\\CreateQuestScriptAutos",
	isEnabled: function () {
		var events = studio.window.browserSelection();
		return events
    },

    humanize: function (str) {
      var i, frags = str.split('_');
      for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    },
    
    execute: function () {
        var events = studio.window.browserSelection();

        /* text */
        var lineBreak = "\r\n";
        var nullText = "null";
        var leftCurly = String.fromCharCode(123);
        var rightCurly = String.fromCharCode(125);
        var tab = String.fromCharCode(9);
        var quote = String.fromCharCode(34);
        var modifier = "public static string "
        var header = "namespace PowerScript" + lineBreak + leftCurly + lineBreak;

        var classText = tab + "public static partial class S" + lineBreak + tab + leftCurly + lineBreak;

        var finalData = header + classText;

        for (x = 0; x < events.length; x++) {
            var eventName = events[x].name;

            eventName = this.humanize(eventName).replace(/\s+/g, '');

            finalData += tab + tab + modifier + eventName + " = " + quote + events[x].getPath() + quote + ";" + lineBreak;

            if(x != events.length - 1)
                finalData += lineBreak;
        }

        finalData += tab + rightCurly + lineBreak + rightCurly;

        var projectPath = studio.project.filePath;
        projectPath = projectPath.substr(0, projectPath.lastIndexOf("/"));
        var filePath = projectPath + "/Scripts/" + "QuestScriptAutosExtension.cs";
		var file = studio.system.getFile(filePath);

		file.open(studio.system.openMode.WriteOnly);
		file.writeText(finalData);
		file.close();
    }
});