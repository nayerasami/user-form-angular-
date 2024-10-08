import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { GenericService } from 'src/app/services/generic.service';
import { ItemsService } from 'src/app/services/items.service';
@Component({
  selector: 'app-reusable-pick-list',
  templateUrl: './reusable-pick-list.component.html',
  styleUrls: ['./reusable-pick-list.component.css']
})
export class ReusablePickListComponent implements OnInit {
  @Input() options: any;
  @Output() myEvent = new EventEmitter()
  items: any;
  savedSelectedItems: any[] = [];
  originalSavedSelectedItems: any[] = [];
  defaultValues: any[] = [];

  selectedItems: any[] = [];
  //defaultAdded: any[] = []
  // defaultDeleted: any[] = []

  uniqueKey: any;
  showKey: any;
  searchQuery: any;
  selectedSearchQuery: any;
  hasError: boolean = false;
  errorMsg: string = '';
  isSearchable: boolean = false;
  isSortable: boolean = false;
  endPoint: string = ''


  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.items = this.options.itemsArr;
    this.uniqueKey = this.options.uniqueKey || 'id';
    this.showKey = this.options.showKey || 'name';
    this.defaultValues = this.options.defaultValuesArr;
    this.isSearchable = this.options.isSearchable;
    this.isSortable = this.options.isSortable;
    this.options.itemsArr = this.removeDuplicate(this.options.itemsArr);
    this.items = this.removeDuplicate(this.items);
    this.endPoint = this.options.baseUrl
    this.handleDefaultValues()
  }

  handleDefaultValues() {
    if (this.defaultValues) {
      this.originalSavedSelectedItems = [...this.removeDuplicate(this.defaultValues)]
      this.savedSelectedItems = [...this.originalSavedSelectedItems]

      this.items = this.items.filter((el: any) => {
        const itemKey = el[this.uniqueKey] ? el[this.uniqueKey] : el;

        const index = this.defaultValues.findIndex(defaultItem => {
          const defaultItemKey = defaultItem[this.uniqueKey] ? defaultItem[this.uniqueKey] : defaultItem;
          return defaultItemKey === itemKey;
        });

        return index === -1;
      });
    } else {
      this.originalSavedSelectedItems = [...this.savedSelectedItems]
    }
  }

  setPickListItems(array: any) {
    this.options.itemsArr = [...array];
    this.items = [...this.options.itemsArr]; 
  }
  

  selectItems(item: any) {
    const value = item[this.uniqueKey] ? item[this.uniqueKey] : item
    const index = this.selectedItems.findIndex((selectedItem: any) => {
      const selectedValue = typeof selectedItem === 'object' ? selectedItem[this.uniqueKey] : selectedItem;
      return selectedValue === value;
    })

    const isSelectingFromItems = this.items.some((availableItem: any) => {
      const availableItemKey = availableItem[this.uniqueKey] ? availableItem[this.uniqueKey] : availableItem;
      return availableItemKey === value;
    });

    const isSelectingFromSavedItems = this.savedSelectedItems.some((savedItem: any) => {
      const savedItemKey = savedItem[this.uniqueKey] ? savedItem[this.uniqueKey] : savedItem;
      return savedItemKey === value;
    })

    const isSelectingOnlyFromItems = this.selectedItems.every(selectedItem =>
      this.items.some((availableItem: any) => {
        const selectedItemKey = selectedItem[this.uniqueKey] ? selectedItem[this.uniqueKey] : selectedItem;
        const availableItemKey = availableItem[this.uniqueKey] ? availableItem[this.uniqueKey] : availableItem;
        return selectedItemKey === availableItemKey;
      }))

    const isSelectingOnlyFormSaved = this.selectedItems.every(selectedItem =>
      this.savedSelectedItems.some((savedItem: any) => {
        const selectedItemKey = selectedItem[this.uniqueKey] ? selectedItem[this.uniqueKey] : selectedItem;
        const savedItemKey = savedItem[this.uniqueKey] ? savedItem[this.uniqueKey] : savedItem;
        return selectedItemKey === savedItemKey;
      }))


    if (isSelectingFromItems && isSelectingOnlyFromItems) {
      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 1);
      }
    } else if (isSelectingFromSavedItems && isSelectingOnlyFormSaved) {
      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 1);
      }
    } else {
      this.selectedItems = [item];
    }


  }


  isSelected(item: any): boolean {
    const itemKeyValue = typeof item === 'object' ? item[this.uniqueKey] : item;
    const index = this.selectedItems.findIndex((selectedItem: any) => {
      const selectedItemKeyValue = typeof selectedItem === 'object' ? selectedItem[this.uniqueKey] : selectedItem;
      return selectedItemKeyValue === itemKeyValue;
    });
    return index !== -1;
  }


  saveSelectedValues() {
    if (this.selectedItems.length > 0) {
      const addedItems = this.savedSelectedItems.filter((el: any) => {
        return !this.selectedItems.includes(el)
      })
      this.savedSelectedItems = [...addedItems, ...this.selectedItems]
      this.originalSavedSelectedItems = [...this.savedSelectedItems];
      this.myEvent.emit(this.originalSavedSelectedItems)
      this.items = this.items.filter((el: any) => {
        return !this.savedSelectedItems.includes(el);
      });
      this.selectedItems = []

    }

  }


  validate() {
    if (this.selectedItems.length === 0 && this.savedSelectedItems.length === 0) {
      this.hasError = true;
      this.errorMsg = this.options.validators.function(this.selectedItems);
    } else {
      this.hasError = false;
      this.errorMsg = ''; 
    }
  }
  


  deleteSelected() {
    if (this.savedSelectedItems.length > 0) {
      this.savedSelectedItems = this.savedSelectedItems.filter((el: any) => {
        return !this.selectedItems.includes(el)
      })
      this.originalSavedSelectedItems = [...this.savedSelectedItems]
      this.myEvent.emit(this.originalSavedSelectedItems)

      const itemsToAdd = this.selectedItems.filter((item: any) => {
        return !this.items.some((availableItem: any) => {
          return (typeof availableItem === 'object' ? availableItem[this.uniqueKey] : availableItem) === (typeof item === 'object' ? item[this.uniqueKey] : item);
        });
      });

      this.items = [...this.items, ...itemsToAdd]
      this.selectedItems = [];
    }
  }

  saveAll() {
    this.savedSelectedItems = [...this.items, ...this.savedSelectedItems]
    this.originalSavedSelectedItems = [...this.savedSelectedItems];
    this.myEvent.emit(this.originalSavedSelectedItems)
    this.items = []
    this.selectedItems = []
  }

  DeleteAll() {
    this.items = [...this.items, ...this.savedSelectedItems]
    this.savedSelectedItems = []
    this.originalSavedSelectedItems = []
    this.myEvent.emit(this.originalSavedSelectedItems)
    this.selectedItems = []
  }

  searchValues(query: any, items: any, originalItems: any) {
    const lowerCaseQuery = query.toLowerCase().trim()
    if (lowerCaseQuery == '') {
      return [...originalItems]
    } else {
      return items.filter((item: any) => {
        const value = item[this.showKey] ? item[this.showKey] : item
        return value.toString().toLowerCase().includes(lowerCaseQuery)
      })
    }
  }

  searchInAvailableValues() {
    this.items = this.searchValues(this.searchQuery, this.items, this.options.itemsArr);
  }

  searchInSavedValues() {
    this.savedSelectedItems = this.searchValues(this.selectedSearchQuery, this.savedSelectedItems, this.originalSavedSelectedItems);
  }

  genericSortAscending(itemsArr: any) {
    itemsArr.sort((a: any, b: any) => {
      const firstItem = a[this.showKey] ? a[this.showKey].toLowerCase() : a;
      const secondItem = b[this.showKey] ? b[this.showKey].toLowerCase() : b;
      if (firstItem < secondItem) {
        return -1;
      }
      if (firstItem > secondItem) {
        return 1;
      }
      return 0

    });
  }

  genericSortDescending(itemsArr: any) {
    itemsArr.sort((a: any, b: any) => {
      const firstItem = a[this.showKey] ? a[this.showKey].toLowerCase() : a;
      const secondItem = b[this.showKey] ? b[this.showKey].toLowerCase() : b;
      if (firstItem > secondItem) {
        return -1;
      }
      if (firstItem < secondItem) {
        return 1;
      }
      return 0
    });

  }


  drop(event: CdkDragDrop<any[]>) {

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    this.myEvent.emit(this.savedSelectedItems)
    this.selectedItems = []
    if (this.savedSelectedItems.length == 0) {
      this.hasError = true
      this.errorMsg = this.options.validators.function(this.selectedItems)
    } else {
      this.hasError = false;
    }

  }


  removeDuplicate(array: any[]) {
    if (!array || !Array.isArray(array)) {
      return []; 
    }
  
    const filteredArr = array.filter((el: any, index: number, self: any[]) => {
      const elKey = el[this.uniqueKey] ? el[this.uniqueKey] : el;
      const arrayElIndex = self.findIndex((item: any) => {
        const itemKey = item[this.uniqueKey] ? item[this.uniqueKey] : item;
        return itemKey === elKey;
      });
      return arrayElIndex === index;
    });
  
    return filteredArr;
  }
  

  
  setPickedItems(array:any) {

    this.savedSelectedItems = [
      ...this.savedSelectedItems,
      ...this.removeDuplicate(array)
    ];
 
    this.items = this.items.filter((el: any) => {
      const itemKey = el[this.uniqueKey] ? el[this.uniqueKey] : el;
      const index = array.findIndex((item:any) => {
        const arrayItemKey = item[this.uniqueKey] ? item[this.uniqueKey] : item;
        return arrayItemKey === itemKey;
      });
      return index === -1;
    });

    this.savedSelectedItems = this.removeDuplicate(this.savedSelectedItems);
    this.myEvent.emit([...this.savedSelectedItems]);

  }



  deleteSomeItems(selectedItemsArr:any) {
      //remove the default deleted from the saved array

      this.savedSelectedItems = this.savedSelectedItems.filter((el: any) => {
        const itemKey = el[this.uniqueKey] ? el[this.uniqueKey] : el;
        const index = selectedItemsArr.findIndex((defaultItem:any) => {
          const defaultItemKey = defaultItem[this.uniqueKey] ? defaultItem[this.uniqueKey] : defaultItem;
          return defaultItemKey === itemKey;
        });
        return index === -1;
      });

      //filter the items to add back to the items array 

      const itemsToAddBack = selectedItemsArr.filter((item: any) => {
        const itemKey = item[this.uniqueKey] ? item[this.uniqueKey] : item;
        return !this.items.some((existingItem: any) => {
          const existingItemKey = existingItem[this.uniqueKey] ? existingItem[this.uniqueKey] : existingItem;
          return existingItemKey === itemKey;
        });
      });

      this.items = [...this.items, ...itemsToAddBack];

    


  }
}
