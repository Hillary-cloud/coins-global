//JQuery Gallery v2 By Ben Beckford

/************LAYOUTS*************

- minimal
- titleOverlay
- thumbOverlayLeft
- thumbOverlayRight
- nodesOnly
- arrowsOnly
- arrowsOnlyTitleAbove
- thumbs
- slideOutThumbs
- arrowsTitleOnly
- imagesOnly
- thumbsAndArrows
- thumbsArrowsNeedle
- nodesArrowsNeedle
- nodesArrows
- nodesArrowsWrap

*/

/************CONTROLS************

- scaleUp
others undocumented yet

*/

function Gallery(params){



	//PARSE XML
	var parseXML = function(xml)
	{

		numImages = $(xml).find('item').length;

		var order = "normal";

		if(params.order != null) { order = params.order; }

		if(order == 'fixedRandom')
		{
			currentNum = Math.floor(Math.random() * numImages);
		}
		else if(params.startAt != null)
		{
			currentNum = parseInt(params.startAt);
		}


		var i = 0;

		if(order == "reverse")
		{
			i = $(xml).find('item').length - 1;
		}

		if(params.infiniteScroll != null)
		{
			infiniteScroll = params.infiniteScroll;
		}

		var youtubeRSSMode = params.xmlPath != null ? params.xmlPath.indexOf("youtube.com") !== -1 : false;

		$(xml).find('item').each(function(){

			var imagePath = "";

			if(!youtubeRSSMode)
			{
				imagePath = imageFolder + encodeURI($(this).find('file').text());
			}
			else
			{
				imagePath = $($(this)[0].childNodes[5].textContent).find('img').attr('src');
			}

			/*
			$(xml).find('item').each(function(){
				var itemXML = '<item><file>' + $($(this)[0].childNodes[5].textContent).find('img').attr('src') + '</file><title><![CDATA[ test_video_thumb ]]></title><desc>' + escape($(this)[0].childNodes[6].textContent) + '</desc><link>' + escape($(this)[0].childNodes[6].textContent) + '</link></item>';
				newXMLData += itemXML;
			});
			*/

			if(params.retina == true)
			{
				var lastDotIndex = imagePath.lastIndexOf(".");
				imagePath = imagePath.slice(0, lastDotIndex) + "@2x" + imagePath.slice(lastDotIndex);
			}

			var linkURL = "";
			if(!youtubeRSSMode)
			{
				linkURL = encodeURI($(this).find('link').text());
			}
			else
			{
				linkURL = encodeURI($(this)[0].childNodes[6].textContent);
			}

			var isSWF = false;

			if(imagePath.indexOf('.swf') != -1)
			{
				isSWF = true;
			}

			linkArray.push(linkURL);

			var newTitleString = $(this).find('title').text();

			if(params.explicitTitleArray != null && params.explicitTitleArray[i] != null)
			{
				newTitleString = params.explicitTitleArray[i];
			}

			if(params.wrapTitleInPTags)
			{
				titleArray.push('<p>'+newTitleString+'</p>');
			}
			else
			{
				titleArray.push(newTitleString);
			}

			var descNodeName = youtubeRSSMode ? "description" : "desc";

			if(params.loadCaptionFromLinkInSelector)
			{
				captionArray.push("");
			}
			else if(params.wrapCaptionInPTags)
			{
				captionArray.push('<p>'+$(this).find(descNodeName).text()+'</p>');
			}
			else
			{
				captionArray.push($(this).find(descNodeName).text());
			}

			var imageHTML = "";

			imageHTML += '<div class="indvImageWrapper" id="imageDiv'+i+'" style="width: '+imageWidth+'px; height: '+imageHeight+'px; overflow: hidden;';

			if(params.transition == "fade" ||  params.transition == "blink")
			{
				var z = 100 - i;

				if(i == currentNum)
				{
					imageHTML += ' position: absolute; margin-top: 0; z-index: 500;';
				}
				else
				{
					imageHTML += ' position: absolute; margin-top: 0; z-index: '+z+';';
				}

			}

			if(params.transition == "slideHorizontal")
			{
				imageHTML += ' float: left;';
			}
			else
			{
				imageHTML += ' float: none;';
			}

			imageHTML += '">';

			var clickable = false;
			if(!isSWF)
			{
				if(params.imagesClickable == true) { clickable = true; }

				if(linkURL == "" || linkURL == " " || linkURL == null)
				{
					clickable = false;
				}
			}

			var target = "";
			if(params.linkTarget != null) { target = params.linkTarget; }

			if(clickable)
			{
				imageHTML += '<a href="' + linkURL + '" target="' + target + '">';
			}

			if(isSWF)
			{
				imageHTML += '<object width="'+imageWidth+'" height="'+imageHeight+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"><param name="SRC" value="'+imagePath+'"><embed src="'+imagePath+'" width="'+imageWidth+'" height="'+imageHeight+'"></embed></object>';
			}
			else
			{
				imageHTML += '<img />';
			}


			if(clickable)
			{
				imageHTML += '</a>';
			}

			imageHTML += '</div>';

			var thisImage = $(imageHTML).appendTo($this + " .mover");

			if(params.transition == "fade" ||  params.transition == "blink")
			{
				if(i != currentNum)
				{
					thisImage.animate(
					{opacity: 0},
					{duration: 0,
					easing: 'linear'});
				}
			}

			$('img', thisImage).load(function(){

				var imageID = "";

				if(params.imagesClickable)
				{
					imageID = $(this).parent().parent().attr('id');
				}
				else
				{
					imageID = $(this).parent().attr('id');
				}

				if(params.fitImage)
				{
					$($this + ' #'+imageID+' img').each(function() {
						fitImage(imageWidth, imageHeight, $(this));
					});

				}

				if(params.transition == "fade" ||  params.transition == "blink")
				{

					var thisParent = $(this).parent();
					if(clickable) { thisParent = thisParent.parent(); }

					var mover = thisParent.parent();

					//thisParent.css('display', 'none');

					imageLoadCount++;
					if(imageLoadCount == numImages)
					{
						//$($this + " .indvImageWrapper").css({'display' : 'none'});
						$("#imageDiv" + currentNum, mover).css({'display': 'inline'});
					}
				}

				if(imageID == "imageDiv"+currentNum)
				{
					startGallery();
				}


			}).attr("src", imagePath);

			if(nodesOn)
			{
				$($this + " .navNodes").append('<li><div class="node"><a href="#" style="display:block; width:100%; height:100%;"><div class="fadeThis"><p>h</p><span class="hover"></span></div></a></div></li>');

				$($this + " .fadeThis:last").each(function () {
					var $span = $($this + " > span.hover", this).css('opacity', 0);
				});

				var imageNum = i;

				$($this + " .node:last a").click(function(event){
					event.preventDefault();
					getImage(imageNum);
				});
			}

			if(thumbsOn)
			{
				var thumbPath = imagePath;

				if(params.customThumbs == true)
				{
					thumbPath = thumbPath.split('.');
					thumbPath[thumbPath.length-2] += "_thumb";
					thumbPath = thumbPath.join('.');
				}

				$($this + " .thumbnails").append('<li class="unselected"><div class="thumbImgWrapper"><img src="' + thumbPath + '" /></div></li>');

				var liWidth = parseInt($($this + " .thumbnails li .thumbImgWrapper").css('width'));
				var liHeight = parseInt($($this + " .thumbnails li .thumbImgWrapper").css('height'));

				$('.thumbImgWrapper:last img').load(function(){cropImage(liWidth, liHeight, $(this));});

				var imageNum = i;

				$($this + " .thumbImgWrapper:last").click(function(event){
					 event.preventDefault();
					 getImage(imageNum);
				});
			}

			if(order == "reverse")
			{
				i--;
			}
			else
			{
				i++;
			}
		});


		if(order == "reverse")
		{
			linkArray.reverse();
			titleArray.reverse();
			captionArray.reverse();
		}

		if(infiniteScroll && numImages > 1)
		{
			var allImagesHtml = $($this + " .mover").html();
			$($this + " .mover").append(allImagesHtml+allImagesHtml);
			infiniteScrollLeftOffset = numImages * imageWidth;
			$($this + " div.mover").stop().animate({marginLeft: -infiniteScrollLeftOffset}, 0, "linear");
		}


		if(titlesOn)
		{
			var titlesHTML = "";

			if(params.firstTitleOnly)
			{
				titlesHTML += '<div class="titleWrapper" id="titleElement'+0+'">'+titleArray[0]+'</div>';
			}
			else
			{
				var q = 0;

				for(q = 0; q < titleArray.length; q++ )
				{
					titlesHTML += '<div class="titleWrapper" id="titleElement'+q+'">'+titleArray[q]+'</div>';
				}
			}

			$(titlesHTML).appendTo($this + " .titles")
		}

		if(captionsOn)
		{
			var captionsHTML = "";

			if(params.firstCaptionOnly)
			{

				captionsHTML = '<div class="captionWrapper" id="captionElement'+0+'">'+captionArray[0]+'</div>';

			}
			else
			{
				var q = 0;

				for(q = 0; q < titleArray.length; q++ )
				{
					captionsHTML += '<div class="captionWrapper" id="captionElement'+q+'">'+captionArray[q]+'</div>';
				}
			}

			$(captionsHTML).appendTo($this + " .captions")
		}


		if(thumbsHide)
		{
			navNodeWrapperHoverMargin = parseInt($($this + " .navNodesWrapper").css("marginTop"));
			navBarHoverMargin = parseInt($($this + " .navBar").css("marginTop"));
			navBarHoverHeight = $($this + " .navBar").height();
			navBarOffHeight = navBarHoverHeight - (params.navBarOffMargin - navBarHoverMargin);

			$($this + ' .navBar').mouseenter(navOverAnim);
			$($this + ' .navNodesWrapper').mouseenter(navOverAnim);
			$($this + ' .navBar').mouseleave(navOutAnim);
			$($this + ' .navNodesWrapper').mouseleave(navOutAnim);
			navOutAnim();

		}

		$($this).mouseenter(onGalleryOver);
		$($this).mouseleave(onGalleryOut);
		onGalleryOut(true);

		numImages = $(xml).find('item').length;


		if(linkDivOn)
		{
			var totalString = new String();
			for(var m = 0; m < linkArray.length; m++)
			{
				totalString += linkArray[m];
			}

			if(totalString != "")
			{
				$($this + " .linkDiv").click(function(event){
					event.preventDefault();
					getLink();
				});
			}
		}

		if(nodesOn)
		{
			if(params.nodesAlign != "left")
			{
				var liWidth = $($this + " .navNodes li").width();
				var liMarginLeft = parseInt($($this + " .navNodes li").css('marginLeft'));
				var liMarginRight = parseInt($($this + " .navNodes li").css('marginRight'));
				if(liMarginLeft){	liWidth+=liMarginLeft;	}
				if(liMarginRight){	liWidth+=liMarginRight;	}
				var newWidth = liWidth * numImages;
				var parentWidth = $($this + " .navNodesWrapper").width();
				var halfNodeWidth = $($this + " .navNodes li").width() / 2;
				needleStartScale = halfNodeWidth;

				var leftMargin = parentWidth - newWidth;

				if(params.nodesAlign == "right")
				{
					$($this + " ul.navNodes").css('marginLeft', leftMargin);

					needleStartScale = leftMargin + halfNodeWidth;
				}
				else
				{
					var leftMarginHalf = parseInt(leftMargin / 2);

					$($this + " ul.navNodes").css('marginLeft', leftMarginHalf);

					needleStartScale = leftMarginHalf + halfNodeWidth;
				}
			}
		}

		if(thumbsOn)
		{
			if(params.thumbsAlign != "left")
			{
				var liWidth = parseInt($($this + " .thumbnails li").css('width'));
				liWidth += parseInt($($this + " .thumbnails li").css('marginLeft'));
				liWidth += parseInt($($this + " .thumbnails li").css('marginRight'));
				var borderLeftWidth = parseInt($($this + " .thumbnails li").css('borderLeftWidth'));
				if(borderLeftWidth)
				{//if this is 0 IE makes it null and messes it up so we have to check it
					liWidth += borderLeftWidth;
				}
				var borderRightWidth =  parseInt($($this + " .thumbnails li").css('borderRightWidth'));
				if(borderRightWidth)
				{
					liWidth += borderRightWidth;
				}
				var newWidth = liWidth * numImages;
				var parentWidth = parseInt($($this + " .thumbsWrapper").css('width'));


				if(params.nodesAlign == "right")
				{
					$($this + " .thumbnails").css('marginLeft', (parentWidth - newWidth));
				}
				else
				{
					$($this + " .thumbnails li:last-child").css('marginRight', 0);
					$($this + " .thumbnails").css('marginLeft', (parentWidth - newWidth) / 2);
				}
			}
		}

		if(numImages == 1)
		{
			$($this + " .navBtns").empty();
			$($this + " .navBar").empty();
		}

		if(params.loadedCallback != null)
		{
			params.loadedCallback($this);
		}

		//getImage(currentNum);
	}

	var startGallery = function() {
		if(!galleryStarted)
		{
			galleryStarted = true;
			getImage(currentNum);
		}
	}

	var getImage = function(num)
	{

		$($this + ' .indvImageWrapper.wasOn').removeClass("wasOn");
		$($this + ' .indvImageWrapper.on').removeClass("on").addClass("wasOn");

		if(num == -1)
		{//left
			num = currentNum - 1;
		}
		else if(num == -2)
		{//right
			num = currentNum + 1;
		}

		if(numImages > 1)
		{
			if(params.looping)
			{
				if(slideInterval > 0)
				{
					clearTimeout(slideTimer);
					slideTimer = setTimeout(nextImage, slideInterval);
				}
			}
			else if (num < numImages - 1)
			{
				if(slideInterval > 0)
				{
					clearTimeout(slideTimer);
					slideTimer = setTimeout(nextImage, slideInterval);
				}
			}
		}

		if(num < 0)
		{
			num = numImages - 1;
			if(infiniteScroll)
			{
				var currentMarginLeft = parseInt($($this + " div.mover").css('margin-left'));
				$($this + " div.mover").stop().animate({marginLeft: currentMarginLeft-infiniteScrollLeftOffset}, 0, "linear");
			}
		}
		else if (num > numImages - 1)
		{
			num = 0;
			if(infiniteScroll)
			{
				var currentMarginLeft = parseInt($($this + " div.mover").css('margin-left'));
				$($this + " div.mover").stop().animate({marginLeft: currentMarginLeft+infiniteScrollLeftOffset}, 0, "linear");
			}
		}

		$($this + ' #imageDiv'+num).addClass("on");

		var oldNum = currentNum+1;
		$($this + " .thumbnails li:nth-child(" + oldNum + ")").removeClass('selected').addClass('unselected')

		var $$$this = $($this);

		if(params.panScale != 1)
		{
			panImageAnim(num);
		}

		if(params.transition == "slideHorizontal")
		{
			$($this + " div.mover").stop().animate(
				{marginLeft: -(imageWidth * num) - infiniteScrollLeftOffset},
				{duration: params.animSpeed,
				easing: params.animTransition});
		}
		else if(params.transition == "slideVertical")
		{
			$($this + " div.mover").stop().animate(
				{marginTop: -(imageHeight * num)},
				{duration: params.animSpeed,
				easing: params.animTransition});
		}
		else if(params.transition == "fade")
		{
			if(currentNum != num)
			{
				$("#imageDiv" + currentNum, $$$this).stop();
				$("#imageDiv" + currentNum, $$$this).clearQueue();
				$("#imageDiv" + num, $$$this).stop();
				$("#imageDiv" + num, $$$this).clearQueue();
				//set all z-indexes to lower
				$(".indvImageWrapper", $$$this).css({'z-index' : '100'});

				$("#imageDiv" + currentNum, $$$this).css({'z-index' : '500'});
				$("#imageDiv" + currentNum, $$$this).css({'opacity' : '1'});

				$("#imageDiv" + num, $$$this).css({'z-index' : '499'});
				$("#imageDiv" + num, $$$this).css({'opacity' : '1'});
				$("#imageDiv" + num, $$$this).css({'display' : 'inline'});

				$("#imageDiv" + currentNum, $$$this).stop().animate(
					{opacity: 0},
					{duration: params.animSpeed,
					easing: params.animTransition,
					complete: function()	{
						$(this).css({'z-index' : '100'});
						$(this).css({'display' : 'none'});
					}
				});

			}

		}
		else if(params.transition == "blink")
		{
			if(currentNum != num)
			{
				$("#imageDiv" + currentNum, $$$this).stop();
				$("#imageDiv" + currentNum, $$$this).clearQueue();
				$("#imageDiv" + num, $$$this).stop();
				$("#imageDiv" + num, $$$this).clearQueue();
				//set all z-indexes to lower
				$(".indvImageWrapper", $$$this).css({'z-index' : '100'});

				$("#imageDiv" + currentNum, $$$this).css({'z-index' : '500'});
				$("#imageDiv" + currentNum, $$$this).stop().animate(
					{opacity: 1},
					{duration: 0,
					easing: params.animTransition
				});

				$("#imageDiv" + num, $$$this).css({'z-index' : '499'});
				$("#imageDiv" + num, $$$this).stop().animate(
					{opacity: 0},
					{duration: 0,
					easing: params.animTransition
				});
				$("#imageDiv" + num, $$$this).css({'display' : 'inline'});

				$("#imageDiv" + currentNum, $$$this).stop().animate(
					{opacity: 0},
					{duration: params.animSpeed / 2,
					easing: params.animTransition,
					complete: function()	{
						$(this).css({'z-index': '100', 'display': 'none'});
					}
				});



				$("#imageDiv" + num, $$$this).stop().delay(params.animSpeed / 2).animate(
					{opacity: 1},
					{duration: params.animSpeed / 2,
					easing: params.animTransition,
					complete: function()	{

					}
				});

			}

		}

		var newImagePath = $("#imageDiv" + num + ' img', $$$this).attr('src');
		$("#imageDiv" + num + ' img', $$$this).attr('src', newImagePath);


		if(needleOn)
		{
			var needleStep = 0;
			var scaleNeedle = false;
			var newWidth = 0;
			var leftMargin = 0;
			var needleAnimSpeed = params.animSpeed;

			if(params.scaleNeedle != null)
			{
				scaleNeedle = params.scaleNeedle;
			}

			var trackWidth = $($this + " div.needleTrack").width();

			if(params.needleStep != null)
			{
				needleStep = params.needleStep;
			}
			else
			{
				needleStep = $($this + " div.needle").width();
			}

			if(params.needleLeftMargin != null)
			{
				leftMargin = params.needleLeftMargin;
			}

			if(params.needleAnimSpeed != null)
			{
				needleAnimSpeed = params.needleAnimSpeed;
			}

			newWidth = (needleStep * num) + (trackWidth / 2) - ((needleStep * numImages) / 2);
			newWidth += leftMargin;

			if(scaleNeedle)
			{
				$($this + " div.needle").stop().animate(
					{width:  newWidth},
					{duration: needleAnimSpeed,
					easing: params.animTransition});
			}
			else
			{
				$($this + " div.needle").stop().animate(
					{marginLeft: needleStep * num},
					{duration: needleAnimSpeed,
					easing: params.animTransition});
			}
		}

		currentNum = num;

		$($this + " .textLabel p").empty();
		$($this + " .textLabel p").append(titleArray[num]);

		if(extCaption != null)
		{
			extCaption.empty();
			if(params.firstCaptionOnly)
			{
				if(params.loadCaptionFromLinkInSelector)
				{
					extCaption.load(linkArray[0]+' '+params.loadCaptionFromLinkInSelector, function(){ /* console.log("loaded"); */ });
				}
				else
				{
					extCaption.append(captionArray[0]);
				}
			}
			else
			{
				if(params.loadCaptionFromLinkInSelector)
				{
					extCaption.load(linkArray[num]+' '+params.loadCaptionFromLinkInSelector, function(){ /* console.log("loaded"); */ });
				}
				else
				{
					extCaption.append(captionArray[num]);
				}
			}
		}

		if(extTitle != null)
		{
			extTitle.empty();

			if(params.firstTitleOnly)
			{
				extTitle.append(titleArray[0]);

			}
			else
			{
				extTitle.append(titleArray[num]);
			}
		}

		if(extHref != null)
		{
			extHref.attr('href', linkArray[num]);
		}

		$($this + " .numberLabel p").empty();
		$($this + " .numberLabel p").append((num+1) + params.labelDelimiter + numImages);

		$($this + " .numberNodes p").empty();
		$(".numberNodes", extNumberNodes).empty();
		var w = 0;
		for(w = 0; w < numImages; w++)
		{
			var numberNodesHTML = "";

			var newNumber = w+1;

			if(w == num)
			{
				numberNodesHTML += '<p class="on">' + newNumber + '</p>';
			}
			else
			{
				numberNodesHTML = '<p><a href="" id="' + w + '">' + newNumber + '</a></p>';
			}

			if(w < numImages-1)
			{
				numberNodesHTML += params.numNodeDelimiter
			}

			$($this + " .numberNodes").append(numberNodesHTML);
			$(".numberNodes", extNumberNodes).append(numberNodesHTML);
		}

		$($this + " .numberNodes p a").click(function(event){
			event.preventDefault();
			var num = $(this).attr('id');
			getImage(num);
		});

		$(".numberNodes p a", extNumberNodes).click(function(event){
			event.preventDefault();
			var num = $(this).attr('id');
			getImage(num);
		});


		$($this + " .node").removeClass("on");

		$($this + " .node .fadeThis span.hover").stop().animate({opacity: 0}, params.animSpeed, params.animTransition);
		num++;
		$($this + " .navNodes li:nth-child(" + num + ") .fadeThis span.hover").stop().animate({opacity: 1}, params.animSpeed, params.animTransition);

		$($this + " .navNodes li:nth-child(" + num + ") .node").addClass("on");


		$($this + " .thumbnails li:nth-child(" + num + ")").removeClass('unselected').addClass('selected')

		if(params.preAnimationCallback != null)
		{
			params.preAnimationCallback(currentNum, $this);
		}


	}

	//allow external access to getImage
	this.getImage = getImage;

	//destroy gallery
	this.destroy = function()
	{
		clearTimeout(slideTimer);
		$($this).empty();
	}

	var nextImage = function()
	{
		getImage(-2);
	}

	//allow external access to nextImage
	this.nextImage = nextImage;

	var prevImage = function()
	{
		getImage(-1);
	}

	//allow external access to nextImage
	this.prevImage = prevImage;

	var getLink = function()
	{
		window.location = linkArray[currentNum];
	}

	var cropImage = function(maxWidth, maxHeight, $imageElm) {

		var $clone = $imageElm.clone().appendTo("body");

		var width = $clone.width();
		var height = $clone.height();

		$clone.remove();

		var ratio1 = (maxWidth + 1) / width;
		var ratio2 = (maxHeight + 1) / height;

		var ratio = ratio2;

		if(width * ratio1 >= maxWidth && height * ratio1 >= maxHeight)
		{
			ratio = ratio1;
		}

		$imageElm.attr('width', (width * ratio));
		$imageElm.attr('height', (height * ratio));
		$imageElm.css('marginLeft', (maxWidth - (width * ratio)) / 2);
		$imageElm.css('marginTop', (maxHeight - (height * ratio)) / 2);
	}

	var fitImage = function(maxWidth, maxHeight, $imageElm) {

		var normalMaxWidth = maxWidth;
		var normalMaxHeight = maxHeight;

		maxWidth *= params.panScale;
		maxHeight *= params.panScale;

		var $clone = $imageElm.clone().appendTo("body");

		var width = $clone.width();
		var height = $clone.height();

		$clone.remove();

		if(width != 0)
		{

			var ratio1, ratio2, ratio = 1;

			var smaller = false;
			if(width < maxWidth && height < maxHeight) { smaller = true; }

			if(params.scaleUp == true || params.panScale != 1 || smaller == false)
			{
				var ratio1 = maxWidth / width;
				var ratio2 = maxHeight / height;

				ratio = ratio2;

				if(params.scaleUp == true || params.panScale != 1)
				{//we want to fill the frame
					if(ratio1 > ratio2)
					{
						ratio = ratio1;
					}
				}
				else
				{//too big and we want to scale down
					if(width * ratio1 <= maxWidth && height * ratio1 <= maxHeight)
					{
						ratio = ratio1;
					}
				}
			}

			var newWidth = (width * ratio);
			var newHeight = (height * ratio);

			$imageElm.attr('width', newWidth).css('width', newWidth+'px');
			$imageElm.attr('height', newHeight).css('height', newHeight+'px');
			$imageElm.css('marginLeft', (normalMaxWidth - newWidth) / 2);
			$imageElm.css('marginRight', (normalMaxWidth - newWidth) / 2);
			$imageElm.css('marginTop', (normalMaxHeight - newHeight) / 2);
			$imageElm.css('marginBottom', (normalMaxHeight - newHeight) / 2);
		}

	}

	var panImageAnim = function(num) {

		var $currentImg = $($this + ' #imageDiv'+num+' img');

		var panHorizontal = params.panDirectionHorizontal;

		if(params.panDirectionHorizontal == "random")
		{
			panHorizontal = panHorizontalArray[Math.ceil(Math.random() * 3) - 1]
		}

		var panVertical = params.panDirectionVertical;

		if(params.panDirectionVertical == "random")
		{
			panVertical = panVerticalArray[Math.ceil(Math.random() * 3) - 1]
		}

		var currentImageWidth = parseInt($currentImg.css('width'));
		var currentImageHeight = parseInt($currentImg.css('height'));

		var marginLeftStart = 0;
		var marginLeftEnd = 0;
		var marginTopStart = 0;
		var marginTopEnd = 0;

		if(panVertical == "none")
		{
			marginTopStart = marginTopEnd = -parseInt((currentImageHeight - imageHeight) / 2);
		}
		else if(panVertical == "up")
		{
			marginTopStart = 0;
			marginTopEnd = imageHeight - currentImageHeight;
		}
		else if(panVertical == "down")
		{
			marginTopStart = imageHeight - currentImageHeight;
			marginTopEnd = 0;
		}

		if(panHorizontal == "none")
		{
			marginLeftStart = marginLeftEnd = -parseInt((currentImageWidth - imageWidth) / 2);
		}
		else if(panHorizontal == "left")
		{
			marginLeftStart = 0;
			marginLeftEnd = imageWidth - currentImageWidth;
		}
		else if(panHorizontal == "right")
		{
			marginLeftStart = imageWidth - currentImageWidth;
			marginLeftEnd = 0;
		}

		$currentImg.stop().css({'margin-left': marginLeftStart+'px', 'margin-top': marginTopStart+'px'}).animate({marginLeft: marginLeftEnd+'px', marginTop: marginTopEnd+'px'}, params.slideInterval+(params.animSpeed/2), "linear");
	}

	var navOverAnim = function()
	{
		$($this + ' .navBar').stop().animate(
			{
				marginTop: navBarHoverMargin,
				height: navBarHoverHeight
			},
			500,
			'easeOutExpo'
		);
		$($this + ' .navNodesWrapper').stop().animate(
			{
				marginTop: navNodeWrapperHoverMargin
			},
			500,
			'easeOutExpo'
		);
	}

	var navOutAnim = function()
	{
		$($this + ' .navBar').stop().animate(
			{
				marginTop: params.navBarOffMargin,
				height: navBarOffHeight
			},
			500,
			'easeInOutSine'
		);
		$($this + ' .navNodesWrapper').stop().animate(
			{
				marginTop: navNodeWrapperHoverMargin + (params.navBarOffMargin - navBarHoverMargin)
			},
			500,
			'easeInOutSine'
		);
	}

	var onGalleryOver = function()
	{
		if(params.fadeButtons)
		{
			$($this + ' .navBtns').stop().animate(
				{
					opacity: 1
				},
				200,
				'easeInOutSine'
			);
		}

		if(params.pauseOnHover)
		{
			pauseGallery();
		}
	}

	var onGalleryOut = function(firstTime)
	{
		if(firstTime != false && firstTime != true)
		{
			firstTime = false;
		}

		if(params.fadeButtons)
		{
			var newAnimTime = 300;

			if(firstTime)
			{
				newAnimTime = 0;
			}

			$($this + ' .navBtns').stop().animate(
				{
					opacity: 0
				},
				newAnimTime,
				'easeInOutSine'
			);
		}

		if(params.pauseOnHover)
		{
			if(!firstTime)
			{
				resumeGallery();
			}
		}
	}

	var pauseGallery = function()
	{
		clearTimeout(slideTimer);
		slideInterval = 0;
	}

	this.pauseGallery = pauseGallery;

	var resumeGallery = function()
	{
		clearTimeout(slideTimer);
		slideInterval = params.slideInterval;
		slideTimer = setTimeout(nextImage, slideInterval);
	}

	this.resumeGallery = resumeGallery;

	if(params.suppressAlerts == null){params.suppressAlerts = true};

	var $this;
	if(params.wrapper != null)
	{
		$this = "." + params.wrapper;
	}
	else if(params.wrapperID != null)
	{
		$this = params.wrapperID;
	}
	else if(!params.suppressAlerts)
	{
		alert("Error, wrapper class not specified");
	}

	if(params.xmlPath == null && params.xmlData == null)
	{
		if(!params.suppressAlerts)
		{
			alert("Error, xmlPath or xmlData not specified");
		}
	}

	if(params.slideInterval == null){ params.slideInterval = 7000; }
	if(params.layout == null){ params.layout = "minimal"; }
	if(params.looping == null){ params.looping = true; }
	if(params.imagesClickable == null){ params.imagesClickable = false; }
	if(params.labelDelimiter == null){ params.labelDelimiter = "/"; }
	if(params.numNodeDelimiter == null){ params.numNodeDelimiter = " "; }
	if(params.nodesAlign == null){ params.nodesAlign = "center"; }
	if(params.thumbsAlign == null){ params.thumbsAlign = "center"; }
	if(params.navBarOffMargin == null){ params.navBarOffMargin = 200; }
	if(params.imageFolder == null){ params.imageFolder = ""; }
	if(params.transition == null){ params.transition = "slideHorizontal"; }
	if(params.fadeButtons == null){ params.fadeButtons = false; }
	if(params.pauseOnHover == null){ params.pauseOnHover = false; }
	if(params.firstCaptionOnly == null){ params.firstCaptionOnly = false; }
	if(params.wrapCaptionInPTags == null){ params.wrapCaptionInPTags = false; }
	if(params.customThumbs == null){ params.customThumbs = false; }
	if(params.retina == null){ params.retina = false; }
	if(params.touch == null){ params.touch = false; }
	if(params.fitImage == null){ params.fitImage = true; }
	if(params.panScale == null){ params.panScale = 1; }
	if(params.panDirectionHorizontal == null){ params.panDirectionHorizontal = "random"; }
	if(params.panDirectionVertical == null){ params.panDirectionVertical = "random"; }

	if(params.animTransition == null)
	{
		if(params.transition == "slideHorizontal" || params.transition == "slideVertical")
		{
			params.animTransition = "easeOutExpo";
		}
		else
		{
			params.animTransition = "easeInOutSine";
		}
	}

	if(params.animSpeed == null)
	{
		if(params.transition == "slideHorizontal" || params.transition == "slideVertical")
		{
			params.animSpeed = 500;
		}
		else
		{
			params.animSpeed = 1000;
		}
	}

	var imageFolder = params.imageFolder;
	var numImages = 0;
	var currentNum = 0;
	var slideTimer;
	var imageWidth;
	var imageHeight;
	var moverX = 0;
	var linkArray = new Array();
	var titleArray = new Array();
	var captionArray = new Array();
	var nodesOn = true;
	var thumbsOn = false;
	var thumbsHide = false;
	var linkDivOn = false;
	var arrowsOn = true;
	var titlesOn = false;
	var captionsOn = false;
	var needleOn = false;
	var navBarHoverMargin = 0;
	var navBarHoverHeight = 0;
	var navBarOffHeight = 0;
	var navNodeWrapperHoverMargin = 0;
	var imageLoadCount = 0;
	var slideInterval = params.slideInterval;
	var needleStartScale = 0;
	var infiniteScroll = false;
	var infiniteScrollLeftOffset = 0;
	var panHorizontalArray = new Array("left", "right", "none");
	var panVerticalArray = new Array("up", "down", "none");
	var galleryStarted = false;

	//EXTERNALS
	var extNumberNodes;
	var extCaption;
	var extTitle;
	var extHref;


	$($this).empty();

	///////////////////////////////LAYOUTS///////////////////////////////
	var htmlArray = new Array();
	//MAIN START - this part normally goes first
	htmlArray.push('<div class="galleryContainer"><div class="mover" style="width: 40000px"></div>');						/*0 */
	//MAIN START END - this part ends galleryContainer, things after this normally float over it
	htmlArray.push('</div>');																								/*1 */
	//nav button wrapper open
	htmlArray.push('<div class="navBtns">');																				/*2 */
	//nav button wrapper close
	htmlArray.push('</div>');																								/*3 */
	//nav button right
	htmlArray.push('<div class="rightBtn"><a href="#"></a></div>');															/*4 */
	//nav button left
	htmlArray.push('<div class="leftBtn"><a href="#"></a></div>');															/*5 */
	//link div for nav button wrapper
	htmlArray.push('<div class="linkDiv"></div>');																			/*6 */
	//nav bar open
	htmlArray.push('<div class="navBar">');																					/*7 */
	//nav bar close
	htmlArray.push('</div>');																								/*8 */
	//text label
	htmlArray.push('<div class="textLabel"><p></p></div>');																	/*9 */
	//number label
	htmlArray.push('<div class="numberLabel"><p></p></div>');																/*10*/
	//nav nodes
	htmlArray.push('<div class="navNodesWrapper"><ul class="navNodes"></ul><div style="clear:both;"></div></div>');			/*11*/
	//thumbnails
	htmlArray.push('<div class="thumbsWrapper"><ul class="thumbnails"></ul><div style="clear:both;"></div></div>');			/*12*/
	//clearing div
	htmlArray.push('<div style="clear:both;"></div>');																		/*13*/
	//nav left section open
	htmlArray.push('<div class="leftSection">');																			/*14*/
	//nav left section close
	htmlArray.push('</div>');																								/*15*/
	//nav right section open
	htmlArray.push('<div class="rightSection">');																			/*16*/
	//nav right section close
	htmlArray.push('</div>');																								/*17*/
	//needle track open
	htmlArray.push('<div class="needleTrack">');																			/*18*/
	//needle track close
	htmlArray.push('</div>');																								/*19*/
	//needle
	htmlArray.push('<div class="needle"></div>');																			/*20*/
	//titles
	htmlArray.push('<div class="titles"></div>');																			/*21*/
	htmlArray.push('<div class="captions"></div>');																			/*22*/




	var layoutArray = new Array();
	//minimal
	layoutArray.push(new Array(0,2,4,5,6,3,1,7,11,8));
	//titleOverlay
	layoutArray.push(new Array(0,1,7,4,5,9,11,8));
	//thumbOverlayLeft
	layoutArray.push(new Array(0,1,7,14,4,5,10,15,16,12,17,8));
	//thumbOverlayRight
	layoutArray.push(new Array(0,1,7,14,12,15,16,4,5,10,17,8));
	//nodesOnly
	layoutArray.push(new Array(0,1,7,11,8));
	//arrowsOnly
	layoutArray.push(new Array(0,2,4,5,6,3,1));
	//arrowsOnlyTitleAbove
	layoutArray.push(new Array(9,0,2,4,5,6,3,1));
	//thumbs
	layoutArray.push(new Array(0,1,7,12,8));
	//slideOutThumbs
	layoutArray.push(new Array(11,7,12,8,0));
	//arrowsTitleOnly
	layoutArray.push(new Array(0,2,4,5,9,6,3,1));
	//imagesOnly
	layoutArray.push(new Array(0,1));
	//thumbsAndArrows
	layoutArray.push(new Array(0,1,7,12,8,2,4,5,6,3));
	//thumbsArrowsNeedle
	layoutArray.push(new Array(0,1,18,20,19,7,12,8,2,4,5,6,3));
	//nodesArrowsNeedle
	layoutArray.push(new Array(0,1,18,20,19,7,11,8,2,4,5,6,3));
	//nodesArrows
	layoutArray.push(new Array(0,1,7,11,8,2,4,5,6,3));
	//nodesArrowsWrap
	layoutArray.push(new Array(0,1,7,5,11,4,8));
	//nodesTitles
	layoutArray.push(new Array(0,1,7,11,8,21));
	//nodesTitlesCaptions
	layoutArray.push(new Array(0,1,7,11,8,21,22));
	//arrowsTitlesCaptions
	layoutArray.push(new Array(0,1,7,2,4,5,6,3,8,21,22));
	//arrowsTitlesCaptionsNeedle
	layoutArray.push(new Array(0,1,7,2,4,5,6,3,8,21,22,18,20,19));
	//arrowsTitlesCaptionsNodes
	layoutArray.push(new Array(0,1,2,4,5,6,3,21,22,7,11,8));
	//nodesCaptions
	layoutArray.push(new Array(0,1,7,11,8,22));
	//arrowsTitles
	layoutArray.push(new Array(0,1,7,2,4,5,6,3,8,21));
	//nodesArrowsTitlesCaptions
	layoutArray.push(new Array(0,1,2,4,5,6,3,7,11,8,21,22));
	//arrowsOnlyCaptions
	layoutArray.push(new Array(0,2,4,5,6,3,1,22));
	/////////////////////////////END LAYOUTS/////////////////////////////

	//Fill out layout html
	var layoutIndex = 0;
	switch(params.layout){
		case "titleOverlay":
			layoutIndex = 1;
			break;
		case "thumbOverlayLeft":
			layoutIndex = 2;
			nodesOn = false;
			thumbsOn = true;
			break;
		case "thumbOverlayRight":
			layoutIndex = 3;
			nodesOn = false;
			thumbsOn = true;
			break;
		case "nodesOnly":
			layoutIndex = 4;
			arrowsOn = false;
			break;
		case "arrowsOnly":
			layoutIndex = 5;
			nodesOn = false;
			break;
		case "arrowsOnlyTitleAbove":
			layoutIndex = 6;
			nodesOn = false;
			break;
		case "thumbs":
			layoutIndex = 7;
			nodesOn = false;
			thumbsOn = true;
			break;
		case "slideOutThumbs":
			layoutIndex = 8;
			nodesOn = true;
			thumbsOn = true;
			thumbsHide = true;
			break;
		case "arrowsTitleOnly":
			layoutIndex = 9;
			nodesOn = false;
			break;
		case "imagesOnly":
			layoutIndex = 10;
			nodesOn = false;
			break;
		case "thumbsAndArrows":
			layoutIndex = 11;
			nodesOn = false;
			thumbsOn = true;
			break;
		case "thumbsArrowsNeedle":
			layoutIndex = 12;
			nodesOn = false;
			thumbsOn = true;
			needleOn = true;
			break;
		case "nodesArrowsNeedle":
			layoutIndex = 13;
			nodesOn = true;
			thumbsOn = false;
			needleOn = true;
			break;
		case "nodesArrows":
			layoutIndex = 14;
			nodesOn = true;
			thumbsOn = false;
			needleOn = false;
			break;
		case "nodesArrowsWrap":
			layoutIndex = 15;
			nodesOn = true;
			thumbsOn = false;
			needleOn = false;
			break;
		case "nodesTitles":
			layoutIndex = 16;
			arrowsOn = false;
			titlesOn = true;
			break;
		case "nodesTitlesCaptions":
			layoutIndex = 17;
			arrowsOn = false;
			titlesOn = true;
			captionsOn = true;
			break;
		case "arrowsTitlesCaptions":
			layoutIndex = 18;
			nodesOn = false;
			titlesOn = true;
			captionsOn = true;
			break;
		case "arrowsTitlesCaptionsNeedle":
			layoutIndex = 19;
			nodesOn = false;
			titlesOn = true;
			captionsOn = true;
			needleOn = true;
			break;
		case "arrowsTitlesCaptionsNodes":
			layoutIndex = 20;
			nodesOn = true;
			titlesOn = true;
			captionsOn = true;
			break;
		case "nodesCaptions":
			layoutIndex = 21;
			arrowsOn = false;
			captionsOn = true;
			break;
		case "arrowsTitles":
			layoutIndex = 22;
			nodesOn = false;
			titlesOn = true;
			captionsOn = false;
			break;
		case "nodesArrowsTitlesCaptions":
			layoutIndex = 23;
			arrowsOn = true;
			titlesOn = true;
			captionsOn = true;
			break;
		case "arrowsOnlyCaptions":
			layoutIndex = 24;
			arrowsOn = true;
			titlesOn = false;
			captionsOn = true;
			break;
	}

	var mainHTML = '';

	var i = 0;
	$.each(layoutArray[layoutIndex], function(){
		mainHTML += htmlArray[layoutArray[layoutIndex][i]];
		if(layoutArray[layoutIndex][i] == 6)
		{
			linkDivOn = true;
		}
		i++;
	});

	$($this).append(mainHTML);

	if(params.externalData != null)
	{
		if(params.externalData.numberNodes != null)
		{
			extNumberNodes = $(params.externalData.numberNodes);
			extNumberNodes.empty();
			extNumberNodes.append('<div class="numberNodes"></div>');
		}

		if(params.externalData.caption != null)
		{
			extCaption = $(params.externalData.caption);
			extCaption.empty();
		}

		if(params.externalData.title != null)
		{
			extTitle = $(params.externalData.title);
			extTitle.empty();
		}

		if(params.externalData.href != null)
		{
			extHref = $(params.externalData.href);
			extHref.attr('href', '');
		}
	}

	if(arrowsOn)
	{
		$($this + " .rightBtn a").click(function(event){
			event.preventDefault();
			getImage(-2);
		});

		$($this + " .leftBtn a").click(function(event){
			event.preventDefault();
			getImage(-1);
		});
	}

	if(params.extRightBtn != null)
	{
		$(params.extRightBtn).click(function(event){
			getImage(-2);
		});
	}

	if(params.extLeftBtn != null)
	{
		$(params.extLeftBtn).click(function(event){
			getImage(-1);
		});
	}

	imageWidth = $($this + ' .galleryContainer').width();
	imageHeight = $($this + ' .galleryContainer').height();

	if(params.xmlPath != null)
	{
		$.ajax({
			type: "GET",
			url: params.xmlPath,
			dataType: "xml",
			success: function(xml) {
				if(params.xmlPath.indexOf("youtube.com") !== -1)
				{
					parseXML($(xml));
				}
				else
				{
					$(xml).find('xml').each(function(){
						parseXML($(this));
					});
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(!params.suppressAlerts)
				{
					alert('Could not load XML "' + params.xmlPath + '", thrown error: ' + thrownError);
				}
			}
		});
	}
	else if(params.xmlData != null)
	{
		parseXML(params.xmlData);
	}

}

function isFunction(possibleFunction) {
	return (typeof(possibleFunction) == typeof(Function));
}
