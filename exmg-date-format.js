import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

/**
* @namespace Exmg
*/
window.Exmg = window.Exmg || {};

/**
* The `<exmg-date-format>` Lightweight element for formatting dates
*
* ```html
*   <exmg-date-format timestamp="1493214988336"></exmg-date-format>
*   <exmg-date-format timestamp="1493214988336" data-pattern="dd/MM/yyyy"></exmg-date-format>
* ```
*
* Example of how to set the default date pattern in the global scope
* ```html
*   window.Exmg.defaultDatePattern = 'dd/MM/yy';
* ```
*
* ### Styling
*
* Custom property | Description | Default
* ----------------|-------------|----------
* `--exmg-date-format` | Mixin applied to host element | `{}`
*
*
* @customElement
* @polymer
* @memberof Exmg
* @group Exmg Core Elements
* @demo demo/index.html
*/
class DateFormatElement extends PolymerElement {
  static get is() {
    return 'exmg-date-format';
  }

  static get properties() {
    return {
      /**
       * Timestamp value of the date to format
       */
      timestamp: {
        type: Number,
      },
      /**
       * Specify the date pattern that should be used. Default pattern is 'MM/dd/yyyy hh:mm:ss a'
       */
      datePattern: {
        type: String,
      },

      _defaultDatePattern: {
        type: String,
        value: 'MM/dd/yyyy hh:mm:ss a',
      },

      /**
       * Computed property that updates when timestamp or date patern changes
       */
      formattedDate: {
        type: String,
        computed: '_computeDate(timestamp, datePattern)',
      },
    };
  }

  static get template() {
    return html`<style>
      :host {
        display: inline-block;
        @apply --exmg-date-format;
      }
      </style>
      [[formattedDate]]`;
  }

  _computeDate(timestamp, datePattern) {
    return this.formatDate(timestamp, datePattern);
  }

  /**
   * This function can be used to manualy format dates. The first parameter
   * can be a timestamp or a Date. Second parameter pattern is optional.
   */
  formatDate(date, datePattern = (Exmg.defaultDatePattern || this._defaultDatePattern)) {
    return date ? this._format(date, datePattern) : '';
  }

  _format(date, pattern) {
    if (typeof date === 'number') {
      date = new Date(date);
    }
    var hours = date.getHours();
    var hours12 = hours <= 12 ? (hours == 0 ? 12 : hours) : hours - 12;
    var dayMode = hours < 12 ? 'AM' : 'PM';
    return pattern.
      replace(/yyyy/g, String(date.getFullYear())).
      replace(/yy/g, String(date.getFullYear()).substr(2).padStart(2, '0')).
      replace(/MM/g, String(date.getMonth() + 1).padStart(2, '0')).
      replace(/dd/g, String(date.getDate()).padStart(2, '0')).
      replace(/hh/g, String(hours12).padStart(2, '0')).
      replace(/HH/g, String(hours).padStart(2, '0')).
      replace(/mm/g, String(date.getMinutes()).padStart(2, '0')).
      replace(/ss/g, String(date.getSeconds()).padStart(2, '0')).
      replace(/tt/g, dayMode).
      replace(/a/g, dayMode);
  }
}

window.customElements.define(DateFormatElement.is, DateFormatElement);

Exmg.DateFormatElement = DateFormatElement;