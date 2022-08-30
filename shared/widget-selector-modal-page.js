import { Page, PageWithDocuments } from './page.js';
import { applyMixins } from './utilities/apply-mixins.js';
import ppp from '../ppp.js';

function onNavigateStart() {
  ppp.app.widgetSelectorModal.visible = false;
}

export class WidgetSelectorModalPage extends Page {
  collection = 'widgets';

  async populate() {
    return (context) => {
      return context.services
        .get('mongodb-atlas')
        .db('ppp')
        .collection('[%#this.page.view.collection%]')
        .find({
          removed: { $ne: true }
        })
        .sort({ updatedAt: -1 });
    };
  }

  async connectedCallback() {
    ppp.app.addEventListener('navigatestart', onNavigateStart, {
      passive: true
    });

    return super.connectedCallback();
  }

  disconnectedCallback() {
    ppp.app.removeEventListener('navigatestart', onNavigateStart);

    super.disconnectedCallback();
  }

  async reload() {
    if (!this.hasAttribute('data-disable-auto-populate'))
      await this.page.view.populateDocuments();
  }
}

applyMixins(WidgetSelectorModalPage, PageWithDocuments);
