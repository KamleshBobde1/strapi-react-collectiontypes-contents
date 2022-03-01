import React from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import { getCollectionTypes, postLoginAdmin, getContents} from './strapi-api';

const loginData = {
    email: "kamlesh.bobde@newvisionsoftware.in",
    password: "Admin@123"
}

class SimpleDropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      selectedCollectionType: 'Select',
      collectionTypesData: [],
      collectionTypesName: [],
      contentTypesData: []

    };

    this.onToggle = isOpen => {
      this.setState({
        isOpen
      });
    };

    this.onSelect = event => {
      this.setState({
        isOpen: !this.state.isOpen,
        selectedCollectionType: event.target.value
      });
      
      this.onFocus();
      if (this.state.selectedCollectionType !== 'Select') {
          let collectionType = '';
          //Temporary code, need to fetch plural name from info object.
          if(this.state.selectedCollectionType.toLocaleLowerCase() === 'city') {
            collectionType = 'cities';
          } else if(this.state.selectedCollectionType.toLocaleLowerCase() === 'project') {
            collectionType = 'projects';
          }  else if(this.state.selectedCollectionType.toLocaleLowerCase() === 'customer') {
            collectionType = 'customers';
          }
        this.fetchContents(collectionType);
      }
    };

    this.onFocus = () => {
      const element = document.getElementById('toggle-id');
      element.focus();
    };

    this.fetchCollectionTypes();
  }

  fetchCollectionTypes = async () => {
    
        const { status, data: { data } } = await postLoginAdmin(loginData);

        if (status === 200) {
            console.log("Login result:", data);
            if (localStorage.getItem('strapiToken')) {
                localStorage.removeItem('strapiToken');
            }
            localStorage.setItem('strapiToken', data.token);
            let contentTypes = await getCollectionTypes(data.token);
            console.log("Content type result before filter:", contentTypes);
            contentTypes = contentTypes.data.data.filter(obj => {
                return obj && (obj.uid && obj.uid.startsWith("api::")) && obj.isDisplayed;
            });
            this.state.collectionTypesData = contentTypes;
            
            this.state.collectionTypesData.map((obj) => {
                this.state.collectionTypesName.push(obj.info.displayName);
            });
            console.log("Collection type name: ", this.state.collectionTypesName);
        } else {
            console.log("Admin login failed");
        }     
   }

   fetchContents = async (collectionType) => {
    console.log("Contents to fetch ", collectionType);
    let contents = await getContents(collectionType);
    console.log("contents:", contents);
   } 

  render() {
    const { isOpen } = this.state;
    let dropdownItems = [];
    dropdownItems = this.state.collectionTypesName.map((item) => {
      return (
        <DropdownItem value={item} key={item} component="button">
          {item}
        </DropdownItem>
      )
    });

    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle id="toggle-id" onToggle={this.onToggle} toggleIndicator={CaretDownIcon}>
            {this.state.selectedCollectionType}
          </DropdownToggle>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
      />
    );
  }
}
export default SimpleDropdown;