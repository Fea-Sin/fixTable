function FixTable(id, obj, _cfg) {
	this.id = id;
	this.obj = obj;
	this.box = this.obj.parentNode;
	var _cfg = _cfg || {};
	this.config = {
		fixHead: _cfg.fixHead || true,
		rows: _cfg.rows || 1,
		cols: _cfg.cols || 0,
		background: _cfg.background || '#dadfea',
		zindex: _cfg.zindex || 9999,
		scrollWidth: _cfg.scrollWidth || 16
	}
	var that = this;
	setTimeout(this.fixTable(this), 100);

	window.onresize = function() {
		that.resize();
	}
}

FixTable.prototype.fixTable = function(_) {
	if (_.obj.rows.length <= 0) {
		return false;
	}

	var hasHead = _.buildHead();
	var hasLeft = _.buildLeft();	
	_.resize();

	_.box.onscroll = function() {
		if (_.divHead != null) {
			_.divHead.scrollLeft = this.scrollLeft;
		}

		if (_.divLeft != null) {
			_.divLeft.scrollTop = this.scrollTop;
		}
	}

	if (hasHead && hasLeft) {
		_.buildTopLeft();
	}
}

FixTable.prototype.resize = function() {
	var _ = this;
	var cellW = parseInt(_.obj.rows[0].cells[0].style.width, 10);
	_.obj.style.width = (cellW * _.obj.rows[0].cells.length) + 'px';

	_.buildHeadResize();
	_.buildLeftResize();	
}

FixTable.prototype.buildHead = function() {
	var _ = this;
	var strDivId = _.id + '_div_head';
	var strTbId = _.id + '_tb_header';
	var div = document.createElement('div');
	div.id = strDivId;
	div.style.cssText = 'position:absolute;left:0;top:0;overflow:hidden;z-index:' + (_.config.zindex + 1) + ';';
  div.innerHTML = '<table id="' + strTbId + '"style="background:' + _.config.background + ';"></table>';

	_.box.insertBefore(div, _.obj);
	_.divHead = div;
	_.tbHead = document.getElementById(strTbId);

	_.buildHeadResize();

	var hasHead = false;
	for(var i=0; i<_.config.rows; i++) {
		var row = _.obj.rows[i];
		if (row != null) {
			_.tbHead.appendChild(row.cloneNode(true));
			hasHead = true;
		}
	}

	return hasHead;	
}

FixTable.prototype.buildHeadResize = function() {
	var _ = this;

	// 滚动条宽度
	var scrollWidth = _.config.scrollWidth;

	// 判断是否出现纵向滚动条，若出现高度减去滚动条宽度
	var sw = _.obj.offsetHeight > _.box.offsetHeight ? scrollWidth : 0;
	_.divHead.style.width = (_.box.offsetWidth - sw) + 'px';
	_.tbHead.style.width = _.obj.offsetWidth + 'px';
}

FixTable.prototype.buildLeft = function() {
	var _ = this;
	if (_.config.cols <= 0) {
		return false;
	}

	var strDivId = _.id + '_div_left';
	var strTbId = _.id + '_tb_left';
	var div = document.createElement('div');
	div.id = strDivId;
	div.style.cssText = 'position:absolute;left:0;top:0;overflow:hidden;z-index:' + _.config.zindex + ';';
	div.innerHTML = '<table id="' + strTbId + '"style="background:' + _.config.background + ';"></table>';
	_.box.insertBefore(div, _.obj);

	_.divLeft = div;
	_.tbLeft = document.getElementById(strTbId);
	_.buildLeftResize();

	var hasLeft = false;
	for(var i=0, rows=_.obj.rows.length; i<rows; i++) {
		var row = _.tbLeft.insertRow(_.tbLeft.rows.length);
		row.style.cssText = _.obj.rows[i].style.cssText;

		for(j=0; j<_.config.cols; j++) {
			var cell = _.obj.rows[i].cells[j];
			if (cell != null) {
				row.appendChild(cell.cloneNode(true));
				cell.style.cssText = _.obj.rows[i].cells[j].style.cssText;
				hasLeft = true;
			}
		}
	}

	return hasLeft;

}

FixTable.prototype.buildLeftResize = function() {
	var _ = this;

	var scrollWidth = _.config.scrollWidth;

	// 判断是否出现横向滚动条，或出现高度减去滚动条高度
	var sw = _.obj.offsetWidth > _.box.offsetWidth ? scrollWidth : 0;
	if (_.divLeft != null) {
		_.divLeft.style.height = (_.box.offsetHeight - sw) + 'px';
	}

}

FixTable.prototype.buildTopLeft = function() {
	var _ = this;
	var strDivId = _.id + '_div_top_left';
	var strTbId = _.id + '_tb_top_left';
	var div = document.createElement('div');
	div.id = strDivId;
	div.style.cssText = 'position:absolute;left:0;top:0;overflow:hidden;z-index:' + (_.config.zindex + 2) + ';';
	div.innerHTML = '<table id="' + strTbId + '" style="background:' + _.config.background + ';"></table>';
	_.box.insertBefore(div, _.obj);

	var tbTopLeft = document.getElementById(strTbId);
	for(var i=0; i<_.config.rows; i++) {
		var row = tbTopLeft.insertRow(tbTopLeft.rows.length);
		row.style.cssText = _.obj.rows[i].style.cssText;

		for(j=0; j<_.config.cols; j++) {
			var cell = _.obj.rows[i].cells[j];
			if (cell != null) {
				row.appendChild(cell.cloneNode(true));
			}
		}
	}
}