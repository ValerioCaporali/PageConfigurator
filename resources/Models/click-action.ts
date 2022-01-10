export enum ClickActionType {
    Link = 0,
    Catalog = 1,
    SalesCampaign = 2,
    ScrollToWidget = 4,
    MultipleCatalog = 5,
    Dialog = 6
}

export interface BaseClickAction {
    Type: ClickActionType;
}

// Catalog actions

export interface CatalogAction extends BaseClickAction {
    GroupId: string;
    GroupValueId?: string;
    GroupValueIds?: string[];
}

export interface CatalogActions extends CatalogAction {
    Actions: CatalogAction[];
}

// Dialog action

export interface DialogAction extends BaseClickAction {
    Content: string;
}

// Link action

export interface LinkAction extends BaseClickAction {
    Url: string;
    External?: boolean;
}

// Sales campaign action

export interface SalesCampaignAction extends BaseClickAction {
    SalesCampaignId?: string;
}

// Scroll action

export interface ScrollClickAction extends BaseClickAction {
    DestinationWidgetId: string;
}
