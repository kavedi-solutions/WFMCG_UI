export interface FilterValues {           // Used for Filter Source & Filter Selection
  title: string;                          // title to send to api call
  dataSource?: FilterValueDataSource[];   // datasource of filter
  value?: FilterValueDataSource;          // value of selected filter
  displayTitle?: string;                  // title to display to filter in UI
  newTitle?: string;                      // displaytitle will be replaced by newTitle when filter option is selected
}

export interface FilterValueDataSource {
  value: string;                          // Value to send to api call
  displayValue: string;                   // value to display in filter in UI
}
