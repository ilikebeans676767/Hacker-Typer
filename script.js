/* *(c) Copyright 2011 Simone Masiero. Some Rights Reserved.
*This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License */
$(function() {
    $(document).keydown(function(event) {
        Typer.addText(event);
    });
});

var Typer = {
    text: null,
    accessCountimer: null,
    index: 0,
    speed: 2,
    file: "",
    accessCount: 0,
    deniedCount: 0,

    init: function() {
        this.accessCountimer = setInterval(function() { Typer.updLstChr(); }, 500);
        $.get(Typer.file, function(data) {
            Typer.text = data;
        });
    },

    content: function() {
        return $("#console").html();
    },
    write: function(str) {
        $("#console").append(str);
        return false;
    },

    makeAccess: function() {
        Typer.hidepop();
        Typer.accessCount = 0;

        // Fake granted info
        var fakeOps = [
            {signal: "stg 0.73", ip: "192.168.4.12", level: "ROOT", location: "PLEASANTON"},
            {signal: "stg 2.23", ip: "10.0.35.99", level: "ADMIN", location: "REMOTE NODE"},
            {signal: "stg 1.68838", ip: "172.31.1.111", level: "JS", location: "FIELD OPS"},
            {signal: "stg 1.58488", ip: "127.0.0.1", level: "DEV access", location: "LOCALHOST"}
        ];
        var f = fakeOps[Math.floor(Math.random()*fakeOps.length)];
        var timestamp = new Date().toLocaleString();

        // Build access granted popup (updated for grey theme, sharp edges)
        var ddiv = $("<div id='gran'>").addClass("accessGranted");
        ddiv.attr("style",
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;" +
            "background:#222;color:#ededed;border:3px solid #888;padding:38px 54px 26px 54px;" +
            "box-shadow:0 8px 30px rgba(0,0,0,0.46);min-width:350px;text-align:left;font-family:Consolas,monospace;font-size:1.53em;" +
            "border-radius:0;"
        )
        .html(
            "<div style='text-align:center; font-size:58px;line-height:66px;'><span style='color:#ededed;'>+</span></div>"+
            "<div style='text-align:center;font-size:1.33em;font-weight:bold;margin-bottom:8px;letter-spacing:2px;'><span style='color:#ededed;'>ACCESS GRANTED</span></div>"+
            "<hr style='border:1px solid #aaa;margin:10px 0 18px 0;opacity:.35;'>"+
            "<div><b>Name:</b> <span style='color:#ededed'>" + f.name + "</span></div>"+
            "<div><b>IP:</b> <span style='color:#bbb'>" + f.ip + "</span></div>"+
            "<div><b>Clearance:</b> <span style='color:#d4d4d4'>" + f.level + "</span> &nbsp; <span style='color:#bbb'>" + f.location + "</span></div>"+
            "<div style='font-size:.77em;color:#aaa;margin-top:7px;'><b>Authorized:</b> " + timestamp + "</div>"+
            "<div style='color:#ccc;font-size:.83em;margin-top:14px;'>All sub-systems unlocked.<br/>Monitoring enabled. Logging active.</div>"
        );
        $(document.body).prepend(ddiv);
        setTimeout(function(){ $("#gran").fadeOut(350,function(){$(this).remove();}); }, 2200);
        return false;
    },

    makeDenied: function() {
        Typer.hidepop();
        Typer.deniedCount = 0;

        var errCodes = [
            "ERR-0x49C2: UNAUTHORIZED ACCESS",
            "ERR-0x501A: INSUFFICIENT CLEARANCE",
            "ERR-0xA12F: SECURITY EXCEPTION",
            "ERR-0x77BF: ACCESS TOKEN REJECTED"
        ];
        var reasons = [
            "Clearance level mismatch.",
            "Authorization header invalid.",
            "Fingerprint not recognized.",
            "Operator flagged for review."
        ];
        var code = errCodes[Math.floor(Math.random()*errCodes.length)];
        var reason = reasons[Math.floor(Math.random()*reasons.length)];
        var timestamp = new Date().toLocaleString();

        // Build access denied popup (updated for grey theme, sharp edges)
        var ddiv = $("<div id='deni'>").addClass("accessDenied");
        ddiv.attr("style",
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;" +
            "background:#555;color:#ededed;border:3.2px solid #aaa;padding:38px 54px 26px 54px;" +
            "box-shadow:0 8px 30px rgba(0,0,0,0.54);min-width:415px;" +
            "text-align:left;font-family:Consolas,monospace;font-size:1.48em;" +
            "border-radius:0;"
        )
        .html(
            "<div style='text-align:center; font-size:56px;line-height:62px;'><span style='color:#ededed;'>_</span></div>"+
            "<div style='text-align:center;font-size:1.22em;font-weight:bold;margin-bottom:6px;letter-spacing:1.2px;'><span style='color:#ededed;'>ACCESS DENIED</span></div>"+
            "<hr style='border:1px solid #888;margin:9px 0 15px 0;opacity:.27;'>"+
            "<div><b>Error Code:</b> <span style='color:#ededed'>" + code + "</span></div>"+
            "<div><b>Reason:</b> <span style='color:#bbb'>" + reason + "</span></div>"+
            "<div><b>Time:</b> <span style='color:#bbb'>" + timestamp + "</span></div>"+
            "<div style='color:#ccc;font-size:.91em;margin-top:12px;border-left:4px solid #aaa;padding-left:9px;'>" +
            "Multiple failed attempts detected.<br/>Session locked. <span style='color:#ededed;'>Contact administrator.</span></div>"
        );
        $(document.body).prepend(ddiv);
        setTimeout(function(){ $("#deni").fadeOut(400,function(){$(this).remove();}); }, 2500);
        return false;
    },

    hidepop: function() {
        $("#deni").remove();
        $("#gran").remove();
        Typer.accessCount = 0;
        Typer.deniedCount = 0;
    },

    addText: function(key) {
        var console = $("#console")
        if (key.key === 'Alt') {
            Typer.accessCount++;
            if (Typer.accessCount >= 3) {
                Typer.makeAccess();
            }
        } else if (key.key === 'Control') {
            Typer.deniedCount++;
            if (Typer.deniedCount >= 3) {
                Typer.makeDenied();
            }
        } else if (key.key === 'Esc' || key.key === 'Escape') {
            Typer.hidepop();
        } else if (Typer.text) {
            var cont = Typer.content();
            if (cont.substring(cont.length-1, cont.length) === "|")
                console.html(console.html().substring(0,cont.length-1));
            if (key.key !== 'Backspace') {
                Typer.index += Typer.speed;
            } else {
                if (Typer.index > 0)
                    Typer.index -= Typer.speed;
            }
            var text = $("<div/>").text(Typer.text.substring(0, Typer.index)).html();
            var rtn = new RegExp("\n", "g");
            var rts = new RegExp("\\s", "g");
            var rtt = new RegExp("\\t", "g");
            console.html(text.replace(rtn,"<br/>").replace(rtt,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts,"&nbsp;"));
            window.scrollBy(0,50);
        }
        if (key.preventDefault && key.key !== 'F11') {
            key.preventDefault();
        }
        if(key.key !== 'F11'){
            key.returnValue = false;
        }
    },

    updLstChr: function() {
        var console = $("#console");
        var cont = this.content();
        if (cont.substring(cont.length-1, cont.length) === "|")
            console.html(console.html().substring(0, cont.length-1));
        else
            this.write("|");
    }
}
