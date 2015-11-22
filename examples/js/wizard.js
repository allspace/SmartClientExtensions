isc.defineClass("QM_DlgExampleWizard", "QM_DlgWizardBase");

isc.QM_DlgExampleWizard.addProperties({
    width:"500px",
    height:"300px",
    align: "center",
    title: "Wizard Example",
    
    initWidget : function () {
    	var curInstance = this;
    	//call parent construct
    	this.Super("initWidget", arguments);
    	
    	this.overviewPage = isc.HTMLPane.create({
    		width: "100%",
    		height: "100%",
    		contents: "<b>This is an overview page.</b>"
    	});
    	
    	this.srcNodePage = isc.DynamicForm.create({
    		width: "100%",
    		height: "100%",
    		fields: [
    		         { name: "SrcNodeName", title:"Host Name/IP", type: "text"},
    		         { name: "SrcNodeUser", title:"User Name", type: "text"},
    		         { name: "SrcNodePwd", title:"Password", type:"password" }
    		         ]
    	});
    	
    	this.dstNodePage = isc.DynamicForm.create({
    		width: "100%",
    		height: "100%",
    		fields: [
    		         { name: "DstNodeName", title:"Host Name/IP", type: "text"},
    		         { name: "DstNodeUser", title:"User Name", type: "text"},
    		         { name: "DstNodePwd", title:"Password", type:"password" }
    		         ]
    	});
    	
    	this.summaryPage = isc.QM_PageWizardSummary.create({
    		width: "100%",
    		height: "100%"
    	});
    	
    	this.addPage({ 
    		menu: { contents: "Overview"},
    		pane: this.overviewPage
    		});
    	this.addPage({
    		menu: { contents: "Source Node"},
    		pane: this.srcNodePage
    	});
    	this.addPage({
    		menu: { contents: "Target Node"},
    		pane: this.dstNodePage
    	});
    	this.addPage({
    		menu: { contents: "Summary"},
    		pane: this.summaryPage
    	});
    	this.selPage(0);
    },
    
    closeClick : function() {
    	var curInstance = this;
    	
    	isc.confirm(
    			"Do you want to close the wizard now?",
    			function(result) {
    				if(result===true){
    					curInstance.close();
    					curInstance.markForDestroy();
    				}
    			}
    	);

    	return false;
    },
    
    onWizardFinish : function() {
    	var curInstance = this;
    	
    	alert("finish is clicked.");
		curInstance.close();
		curInstance.markForDestroy();
    }

});
