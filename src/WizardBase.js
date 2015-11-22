isc.defineClass("QM_DlgWizardBase", "Window");
isc.defineClass("QM_VListNavBar", "VLayout");
isc.defineClass("QM_PageWizardSummary", "VLayout");

isc.QM_VListNavBar.addProperties({
	padding: "5px",
    height:"100%",
    width:"150px",
    curSelIdx:-1,
    
    initWidget : function () {
    	var curInstance = this;
    	this.Super("initWidget", arguments);
    	
    },
    
    addItem : function(item) {
    	var curInstance = this;
    	
    	if(item.height===undefined) item.height = "30px";
    	item.canHover = true;
    	item.showHover= true;
    	item.padding = "3px";
    	item.cursor  = "POINTER";
    	var obj = isc.Label.create(item);
    	obj.click = function() {
    		//alert(this._qm_selfIdx);
    		curInstance.setSelIdx(this._qm_selfIdx);
    	}
    	obj._qm_selfIdx = this.members==null ? 0 : this.members.length;
    	this.addMember(obj);
    },
    
    setSelIdx : function(idx, fireEvent) {
    	if(idx==this.curSelIdx) return; 
    	
    	//fire "onSelChange" event, and decide if we can continue
    	if(this.onSelChange!==undefined && fireEvent!==false) {
    		if(this.onSelChange(idx)===false) return;
    	}
    	
    	if(this.curSelIdx>=0 && this.curSelIdx<this.members.length)
    		this.members[this.curSelIdx].setBackgroundColor(undefined);
    	this.curSelIdx = idx;
    	this.members[this.curSelIdx].setBackgroundColor("#DDDDDD");
    },
    
    setSelNext : function() {
    	var idx = this.curSelIdx >= (this.members.length-1) ? this.curSelIdx : this.curSelIdx + 1;
    	this.setSelIdx(idx);
    },
    
    setSelPrev : function() {
    	var idx = this.curSelIdx <= 0 ? this.curSelIdx : this.curSelIdx - 1;
    	this.setSelIdx(idx);
    }
	
});

isc.QM_DlgWizardBase.addProperties({
    width:"500px",
    height:"300px",
    align: "center",
    
    initWidget : function () {
    	var curWinInstance = this;
    	//call parent construct
    	this.Super("initWidget", arguments);
    	this._qm_curPageIdx = -1;
    	this._qm_pages = new Array();
    	this._qm_title = this.title;
    	
    	this.navPane = isc.QM_VListNavBar.create({
    		onSelChange: function(idx) {
    			curWinInstance.selPage(idx, false);
    			return true;
    		}
    	});    	
    	
    	//this.navPane.addItem({contents:"Step 1"});
    	//this.navPane.addItem({contents:"Step 2"});
    	//this.navPane.addItem({contents:"Step 3"});
    	//this.navPane.setSelIdx(0);
    	
    	this.contentPane = isc.Layout.create({
    		width: "100%",
    		height: "100%",
    		padding: "5px",
    	});
    	
    	
    	this.navBtnPrev = isc.Button.create({
    	    left: 250,
    	    title: "< Previous",
    	    disabled : true,
    	    click: function () { 
    	    	curWinInstance.movePrev();
    	    }
    	});
    	
    	this.navBtnNext = isc.Button.create({
    	    left: 250,
    	    title: "Next >",
    	    disabled : true,
    	    click: function () { 
    	    	curWinInstance.moveNext();
    	    }
    	});
    	
    	this.navBtnFinish = isc.Button.create({
    	    left: 250,
    	    title: "Finish",
    	    disabled : true,
    	    click: function () { if(curWinInstance.onWizardFinish!==undefined)curWinInstance.onWizardFinish(); }
    	});
    	
    	this.navBtnCancel = isc.Button.create({
    	    left: 250,
    	    title: "Cancel",
    	    click: function () { curWinInstance.closeClick(); }
    	});
    	
    	this.navBtnPane = isc.HLayout.create({
    		width: "100%",
    		height: "30px",
    		align: "right",
    		members: [this.navBtnPrev, 
    		          isc.LayoutSpacer.create({width: "10px"}), 
    		          this.navBtnNext,
    		          isc.LayoutSpacer.create({width: "10px"}),
    		          this.navBtnFinish,
    		          isc.LayoutSpacer.create({width: "10px"}),
    		          this.navBtnCancel,
    		          isc.LayoutSpacer.create({width: "10px"}),
    		          ]
    	});
    	
    	this.rightPane = isc.VLayout.create({
    		width: "100%",
    		height: "100%",
    		members: [this.contentPane, this.navBtnPane]
    	});
    	
    	this.mainPane = isc.HLayout.create({
    		width: "100%",
    		height: "100%",
    		members: [this.navPane, this.rightPane]
    	});
    	
    	this.addItem(this.mainPane);
    },
    
    addPage : function(item) {
    	this._qm_pages.push(item);
    	this.navPane.addItem(item.menu); 
    	this.contentPane.addMember(item.pane);
    },
    
    moveNext : function() {
    	var idx = this._qm_curPageIdx >= (this._qm_pages.length - 1) ? this._qm_curPageIdx : this._qm_curPageIdx + 1;
    	this.selPage(idx);
    },
    
    movePrev : function() {
    	var idx = this._qm_curPageIdx <= 0 ? 0 : this._qm_curPageIdx - 1;
    	this.selPage(idx);
    },
    
    selPage : function(idx, triggerMenu) {
    	if(idx==this._qm_curPageIdx) {
    		return;
    	}
    	
    	//fire "onWizardPageLeave" event, and device if we can continue
    	if(this.onWizardPageLeave!==undefined) {
    		if(this.onWizardPageLeave(this._qm_curPageIdx, this._qm_pages[this._qm_curPageIdx])==false) return;
    	}
    	
    	this._qm_curPageIdx = idx;
    	if(triggerMenu!==false) 
    		this.navPane.setSelIdx(this._qm_curPageIdx, false);
    	this.contentPane.setVisibleMember(this._qm_pages[this._qm_curPageIdx].pane);
    	
    	//set title
    	this.setTitle(this._qm_title + " - " + this._qm_pages[this._qm_curPageIdx].menu.contents);
    	
    	//enable or disable [previous]/[next]/[finish] button
    	if(this._qm_curPageIdx>0) {
    		this.navBtnPrev.setDisabled(false);
    	}else{
    		this.navBtnPrev.setDisabled(true);
    	}
    	if(this._qm_curPageIdx < (this._qm_pages.length -1) && this._qm_pages.length!=1) {
    		this.navBtnNext.setDisabled(false);
    	}else{
    		this.navBtnNext.setDisabled(true);
    	}    	
    	if (this._qm_curPageIdx == (this._qm_pages.length -1)) {
    		this.navBtnFinish.setDisabled(false);
    	}else{
    		this.navBtnFinish.setDisabled(true);
    	}
    }

});


isc.QM_PageWizardSummary.addProperties({
	//padding: "5px",
    height:"100%",
    width:"100%",
    
    initWidget : function () {
    	var curInstance = this;
    	this.Super("initWidget", arguments);
    	
    	this.titleLine = isc.Label.create({
    		height: "30px",
    		contents: "Please review the settings below:"
    	});
    	
    	this.settingGrid = isc.ListGrid.create({
    		showHeaderMenuButton: false,
    		showHeaderContextMenu: false,
    		fields:[
    		        { name:"title"  ,title:"Name", width:"200px" },
    		        { name:"value",title:"Value" }
    		        ]
    	});
    	
    	
    	this.addMember(this.titleLine);
    	this.addMember(this.settingGrid);
    },
    
    setData : function(data) {
    	this.settingGrid.setData(data);
    },
    
});
