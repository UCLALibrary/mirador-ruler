var MiradorRuler = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'rulerSettingsTooltip': 'Manage this window&#39;s ruler settings',
                'hideRuler': '(hide ruler)',
                'rulerColorBlack': 'Black',
                'rulerColorWhite': 'White',
                'rulerOrientationHorizontal': 'Horizontal',
                'rulerOrientationVertical': 'Vertical',
                'rulerPositionTopLeft': 'Top Left',
                'rulerPositionTopMiddle': 'Top Middle',
                'rulerPositionTopRight': 'Top Right',
                'rulerPositionMiddleLeft': 'Middle Left',
                'rulerPositionMiddleRight': 'Middle Right',
                'rulerPositionBottomLeft': 'Bottom Left',
                'rulerPositionBottomMiddle': 'Bottom Middle',
                'rulerPositionBottomRight': 'Bottom Right'
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-btn mirador-icon-ruler mirador-tooltip" title="{{t "rulerSettingsTooltip"}}">',
            '<i class="fa fa-lg fa-fw ruler-icon-grey"></i>',
            '<i class="fa fa-lg fa-fw ruler-icon" style="display: none;"></i>',
            '<i class="fa fa-caret-down"></i>',
            '<ul class="dropdown ruler-options-list">',
                '<li class="ruler-hide"><i class="fa fa-ban fa-lg fa-fw"></i> {{t "hideRuler"}}</li>',
                '<li class="ruler-horizontal"><i class="fa fa-arrows-h fa-lg fa-fw"></i> {{t "rulerOrientationHorizontal"}}</li>',
                '<li class="ruler-vertical"><i class="fa fa-arrows-v fa-lg fa-fw"></i> {{t "rulerOrientationVertical"}}</li>',
                '<li class="ruler-black"><i class="fa fa-square fa-lg fa-fw"></i> {{t "rulerColorBlack"}}</li>',
                '<li class="ruler-white"><i class="fa fa-square-o fa-lg fa-fw"></i> {{t "rulerColorWhite"}}</li>',
                '<li class="ruler-top-left"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionTopLeft"}}</li>',
                '<li class="ruler-top-middle"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionTopMiddle"}}</li>',
                '<li class="ruler-top-right"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionTopRight"}}</li>',
                '<li class="ruler-middle-left"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionMiddleLeft"}}</li>',
                '<li class="ruler-middle-right"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionMiddleRight"}}</li>',
                '<li class="ruler-bottom-left"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionBottomLeft"}}</li>',
                '<li class="ruler-bottom-middle"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionBottomMiddle"}}</li>',
                '<li class="ruler-bottom-right"><i class="fa fa- fa-lg fa-fw"></i> {{t "rulerPositionBottomRight"}}</li>',
            '</ul>',
        '</a>',
    ].join('')),

    settings: {
        'type': OpenSeadragon.ScalebarType.MACRO,
        'minWidth': '300px',
        'location': OpenSeadragon.ScalebarLocation.BOTTOM_LEFT,
        'xOffset': 10,
        'yOffset': 10,
        'orientation': OpenSeadragon.ScalebarOrientation.VERTICAL,
        'stayInsideImage': false,
        'color': 'black',
        'fontColor': 'rgb(100, 100, 100)',
        'backgroundColor': 'rgba(255, 255, 255, 0.3)',
        'fontSize': 'small',
        'barThickness': 1
    },

    init: function() {
        var self = this;

        i18next.on('initialized', function() {
            for (var locale in self.locales) {
                // add translations from each locale
                var ns = 'translation';
                i18next.addResourceBundle(locale, ns, self.locales[locale][ns], true, true);
            };
        });

        /*
         * Mirador.Window
         */
        (function($) {
            var bindEvents = $.Window.prototype.bindEvents,
                listenForActions = $.Window.prototype.listenForActions;

            $.Window.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('showRulerUI' + this.id, function() {
                    _this.element.find('.mirador-icon-ruler').css('display', '');
                    _this.setRulerVisibility('visible');
                });
                this.eventEmitter.subscribe('hideRulerUI' + this.id, function() {
                    _this.element.find('.mirador-icon-ruler').css('display', 'none');
                });
            };

            $.Window.prototype.bindEvents = function() {
                var _this = this;
                bindEvents.apply(this, arguments);

                this.element.find('.window-manifest-navigation').prepend(self.template());
                this.element.find('.mirador-icon-ruler').css('display', 'none');

                this.element.find('.mirador-icon-ruler').on('mouseenter', function() {
                    _this.element.find('.ruler-options-list').stop().slideFadeToggle(300);
                    _this.element.find('.ruler-icon-grey').hide();
                    _this.element.find('.ruler-icon').show();
                }).on('mouseleave', function() {
                    _this.element.find('.ruler-options-list').stop().slideFadeToggle(300);
                    _this.element.find('.ruler-icon').hide();
                    _this.element.find('.ruler-icon-grey').show();
                });
                _this.element.find('.mirador-icon-ruler').hide();

                this.element.find('.ruler-hide').on('click', function() {
                  _this.setRulerVisibility('invisible');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerVisibility',
                        arg: 'invisible'
                      }
                    });
                  }
                });

                this.element.find('.ruler-horizontal').on('click', function() {
                  _this.setRulerOrientation('horizontal');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerOrientation',
                        arg: 'horizontal'
                      }
                    });
                  }
                });

                this.element.find('.ruler-vertical').on('click', function() {
                  _this.setRulerOrientation('vertical');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerOrientation',
                        arg: 'vertical'
                      }
                    });
                  }
                });

                this.element.find('.ruler-black').on('click', function() {
                  _this.setRulerColor('black');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerColor',
                        arg: 'black'
                      }
                    });
                  }
                });

                this.element.find('.ruler-white').on('click', function() {
                  _this.setRulerColor('white');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerColor',
                        arg: 'white'
                      }
                    });
                  }
                });

                this.element.find('.ruler-top-left').on('click', function() {
                  _this.setRulerPosition('tl');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'tl'
                      }
                    });
                  }
                });

                this.element.find('.ruler-top-middle').on('click', function() {
                  _this.setRulerPosition('tm');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'tm'
                      }
                    });
                  }
                });

                this.element.find('.ruler-top-right').on('click', function() {
                  _this.setRulerPosition('tr');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'tr'
                      }
                    });
                  }
                });

                this.element.find('.ruler-middle-left').on('click', function() {
                  _this.setRulerPosition('ml');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'ml'
                      }
                    });
                  }
                });

                this.element.find('.ruler-middle-right').on('click', function() {
                  _this.setRulerPosition('mr');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'mr'
                      }
                    });
                  }
                });

                this.element.find('.ruler-bottom-left').on('click', function() {
                  _this.setRulerPosition('bl');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'bl'
                      }
                    });
                  }
                });

                this.element.find('.ruler-bottom-middle').on('click', function() {
                  _this.setRulerPosition('bm');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'bm'
                      }
                    });
                  }
                });

                this.element.find('.ruler-bottom-right').on('click', function() {
                  _this.setRulerPosition('br');

                  if (_this.leading) {
                    _this.eventEmitter.publish('synchronizeRulerControls', {
                      viewObj: _this.focusModules[_this.currentImageMode],
                      value: {
                        fn: 'setRulerPosition',
                        arg: 'bm'
                      }
                    });
                  }
                });
            };

            /** If physical dimensions are available, then set the ruler visibility to 'v'.
             * @param {string} v - ['invisible', 'visible']
             */
            $.Window.prototype.setRulerVisibility = function(v) {
              var osdInstance = this.focusModules.ImageView.osd;
              if (!osdInstance.hasPhysicalDimensionData) {
                return;
              }

              var type;
              if (v === 'invisible') {
                type = OpenSeadragon.ScalebarType.NONE;
              }
              else if (v === 'visible') {
                type = OpenSeadragon.ScalebarType.MACRO;
              }
              osdInstance.scalebar({'type': type});
            };

            /** If physical dimensions are available, then set the ruler orientation to 'o'.
             * @param {string} o - ['horizontal', 'vertical']
             */
            $.Window.prototype.setRulerOrientation = function(o) {
              var osdInstance = this.focusModules.ImageView.osd;
              if (!osdInstance.hasPhysicalDimensionData) {
                return;
              }

              var orientation;
              switch (o) {
                case 'horizontal':
              orientation = OpenSeadragon.ScalebarOrientation.HORIZONTAL;
              break;
            case 'vertical':
              orientation = OpenSeadragon.ScalebarOrientation.VERTICAL;
              break;
              }
              this.setRulerVisibility('visible');
              osdInstance.scalebar({'orientation': orientation});
            };

            /** If physical dimensions are available, then set the ruler color to 'c'.
             * @param {string} c - Any valid CSS color string.
             */
            $.Window.prototype.setRulerColor = function(c) {
              var osdInstance = this.focusModules.ImageView.osd;
              if (!osdInstance.hasPhysicalDimensionData) {
                return;
              }

              this.setRulerVisibility('visible');
              osdInstance.scalebar({'color': c});
            };

            /** If physical dimensions are available, then set the ruler position to 'p'.
             * @param {string} p - ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']
             */
            $.Window.prototype.setRulerPosition = function(p) {
              var osdInstance = this.focusModules.ImageView.osd;
              if (!osdInstance.hasPhysicalDimensionData) {
                return;
              }

              var position;
              switch (p) {
                case 'tl':
              position = OpenSeadragon.ScalebarLocation.TOP_LEFT;
              break;
                case 'tm':
              position = OpenSeadragon.ScalebarLocation.TOP_MIDDLE;
              break;
                case 'tr':
              position = OpenSeadragon.ScalebarLocation.TOP_RIGHT;
              break;
                case 'ml':
              position = OpenSeadragon.ScalebarLocation.MIDDLE_LEFT;
              break;
                case 'mr':
              position = OpenSeadragon.ScalebarLocation.MIDDLE_RIGHT;
              break;
                case 'bl':
              position = OpenSeadragon.ScalebarLocation.BOTTOM_LEFT;
              break;
                case 'bm':
              position = OpenSeadragon.ScalebarLocation.BOTTOM_MIDDLE;
              break;
                case 'br':
              position = OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT;
              break;
              }
              this.setRulerVisibility('visible');
              osdInstance.scalebar({'location': position});
            };
        })(Mirador);

        /*
         * Mirador.ImageView
         */
        (function($) {
            var listenForActions = $.ImageView.prototype.listenForActions;

            $.ImageView.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('image-status-updated' + this.windowId, function(event, imageResource) {

                    if (imageResource.getImageType() === 'main' && imageResource.getStatus() === 'drawn') {
                        // fetch physdim stuff and do magic
                        jQuery.getJSON(imageResource.tileSource).done(function(data) {
                            function isValidPhysdimService(service) {
                                if ((service.profile !== 'http://iiif.io/api/annex/services/physdim')
                                    || (service['@context'] !== 'http://iiif.io/api/annex/services/physdim/1/context.json')) {
                                    console.warn('Physical dimension service is either invalid or not well-formed:');
                                    console.warn(service);
                                    return false;
                                } else {
                                    return true;
                                }
                            }

                            // TODO: ask technical group if need to check for more than one external service in info.json
                            if (data.hasOwnProperty('service')) {

                                // look for physdim service
                                var physdimService;
                                if (Array.isArray(data.service)) {
                                    physdimService = data.service.find(function(e) {
                                        return isValidPhysdimService(e);
                                    });
                                } else {
                                    physdimService = isValidPhysdimService(data.service) ? data.service : undefined;
                                }
                                if (physdimService !== undefined) {
                                    var metersPerPhysicalUnit = {
                                        'mm': 0.001,
                                        'cm': 0.01,
                                        'in': 0.0254
                                    };
                                    var ppm = 1 / (metersPerPhysicalUnit[data.service.physicalUnits] * data.service.physicalScale);
            
                                    var settings = jQuery.extend(true, {}, self.settings, {
                                        'pixelsPerMeter': ppm
                                    });
                                    _this.osd.scalebar(settings);

                                    // Do we need this?
                                    _this.osd.hasPhysicalDimensionData = true;

                                    // render UI controls for ruler
                                    _this.eventEmitter.publish('showRulerUI' + _this.windowId);
                                } else {
                                    console.warn('Physical Dimension service unavailable for ' + imageResource.tileSource)
                                    _this.eventEmitter.publish('hideRulerUI' + _this.windowId);
                                }
                            } else {
                                console.warn('Physical Dimension service unavailable for ' + imageResource.tileSource)
                                _this.eventEmitter.publish('hideRulerUI' + _this.windowId);
                            }
                        });
                    }
                });
            };
        })(Mirador);
    }
};

$(document).ready(function() {
    MiradorRuler.init();
});
