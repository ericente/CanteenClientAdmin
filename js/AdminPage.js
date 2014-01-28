(function(undefined){
	
	var Page = Canteen.Page;

	/**
	*  Admin page utilities
	*  @class Canteen.Pages.AdminPage
	*  @extends Canteen.Page
	*  @constructor
	*  @param {String} nameSelector The selector for the name input
	*  @param {String} uriSelector The selector for the uri input
	*  @param {Boolean} hasEditable If we should do the editable
	*/
	var AdminPage = function(nameSelector, uriSelector){

		/** 
		*  The title object 
		*  @property {jquery} _title
		*  @private
		*/
		this._title = null;

		/** 
		*  The editable textarea
		*  @property {jquery} _editable
		*  @private
		*/
		this._editable = null;

		/** 
		*  The jquery selector for the title input
		*  @property {String} _nameSelector
		*  @private
		*/
		this._nameSelector = nameSelector;

		/** 
		*  The jquery selector for the uri input
		*  @property {String} _uriSelector
		*  @private
		*/
		this._uriSelector = uriSelector;
	},
	
	// The prototype reference
	p = AdminPage.prototype = new Page();
	
	/**
	*  The page is entered
	*  @method enter
	*/
	p.enter = function()
	{
		this._title = this.autoUri(this._nameSelector, this._uriSelector);
		this._editable = this.editable();
	};
	
	/**
	*  The page is exited
	*  @method exit
	*/
	p.exit = function()
	{
		this._title.off('keyup focusin');
		this._title = null;

		if (this._editable)
		{
			this._editable.tinymce().remove();
			this._editable = null;
		}
	};

	/**
	*  Create the autofill uri
	*  @method autoUri
	*  @param {String} titleSelector The title input jquery selector
	*  @param {String} uriSelector The uri input jquery selector
	*  @return {jquery} The title jquery object
	*/
	p.autoUri = function(titleSelector, uriSelector)
	{
		var uri = $(uriSelector);
		var title = $(titleSelector).focusin(function(){
			$(this).keyup(function(){
				uri.val(title.val()
					.trim()
					.replace(/ +/g, '-')
					.replace(/[^a-zA-Z0-9\-]/g, '')
					.toLowerCase()
				);
			});
		});
		return title;
	};

	/**
	*  Create TinyMCE editor for textarea
	*  @method editable
	*  @param {String} selector The textarea selector
	*  @return {jquery|null} The editable jquery node
	*/
	p.editable = function(selector)
	{
		selector = selector !== undefined ? selector : "textarea.editable";
		var editable = $(selector).tinymce({
			browser_spellcheck : true,
			menubar:false,
			//statusbar: false,
			content_css: Canteen.settings.basePath+'assets/css/editor.css'+Canteen.settings.cacheBust,
			plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime media table contextmenu paste"
			],
			toolbar: [
				"insertfile undo redo",
				"styleselect",
				"bold italic",
				"alignleft aligncenter alignright alignjustify",
				"bullist numlist outdent indent",
				"link image",
				"code"
			].join(" | ")
		});

		return editable.length ? editable : null;
	};
	
	// Assign to global space
	namespace("Canteen.Pages").AdminPage = AdminPage;
	
}());