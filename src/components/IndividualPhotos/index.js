//Adapted from https://codepen.io/alexboffey/pen/YWdzYj
//Adapted from https://dev.to/finallynero/generating-pdf-documents-in-react-using-react-pdf-4ka7

import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './individualPhotos.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import PhotosPdf from "./photospdf.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Page, Image, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
	page: {
	  flexDirection: 'row',
	  backgroundColor: '#E4E4E4'
	},
	section: {
	  margin: 10,
	  padding: 10,
	  flexGrow: 1
	},
	image: {
		marginVertical: 15,
		marginHorizontal: 100,
	  },
  });
  
  // Create Document Component
  const PhotosPDF = (props) => (
	<Document>
	  <Page size="A4" style={styles.page}>
		<View style={styles.section}>
			{props.photosList.map(photo =>(
				<View>
				<Image
					style={styles.image}
					src="https://www.wallpapers13.com/wp-content/uploads/2016/01/Cool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600-1600x1200.jpg"
				/>
				<Image allowDangerousPaths={true} fixed={true} src={photo["image"]}/>
				<Text>{props.testProp}</Text>
				<Text>{photo["image"]} yep</Text>
				</View>
			))}
		</View>
	  </Page>
	</Document>
  );

class Tiles extends React.Component {
	render() {
		// Create tile for each item in data array
		// Pass data to each tile and assign a key
		return (
			<div className="tiles">
				{this.props.data.map((data) => {
					return <Tile data={data} key={data.id} />
				})}
			</div>
		);
	}
}

class Tile extends React.Component {
	constructor(props) {
			super(props);
			this.state = {
				open: false,
				mouseOver: false
			};
			// Bind properties to class instance
			this._clickHandler = this._clickHandler.bind(this);
			this._mouseEnter = this._mouseEnter.bind(this);
			this._mouseLeave = this._mouseLeave.bind(this);
		}
		// Event handlers to modify state values
	_mouseEnter(e) {
		e.preventDefault();
		if (this.state.mouseOver === false) {
			console.log(this.props.data.name);
			this.setState({
				mouseOver: true
			})
		}
	}
	_mouseLeave(e) {
		e.preventDefault();
		if (this.state.mouseOver === true) {
			this.setState({
				mouseOver: false
			})
		}
	}
	_clickHandler(e) {
		e.preventDefault();
		if (this.state.open === false) {
			this.setState({
				open: true
			});
		} else {
			this.setState({
				open: false
			});
		}
	}

	render() {
		// Modify styles based on state values
		let tileStyle = {};
		let headerStyle = {};
		let zoom = {};
		// When tile clicked
		if (this.state.open) {
			tileStyle = {
				width: '62vw',
				height: '62vw',
				position: 'absolute',
				top: '50%',
				left: '50%',
				margin: '0',
				marginTop: '-31vw',
				marginLeft: '-31vw',
				boxShadow: '0 0 40px 5px rgba(0, 0, 0, 0.3)',
				transform: 'none'
			};
		} else {
			tileStyle = {
				width: '18vw',
				height: '18vw'
			};
		}

		return (
			<div className="tile">
				<img
					onMouseEnter={this._mouseEnter}
					onMouseLeave={this._mouseLeave}
					onClick={this._clickHandler}
					src={this.props.data.image}
					alt={this.props.data.name}
					style={tileStyle}
				/>
			</div>
		);
	}
}

//OLD STUFF
class IndividualPhotos extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      users: [],
      startDate: new Date(),
      isOpen: false,
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });
    console.log("photoID", this.props.match.params.photoID)

    this.props.firebase.particularPhotos(this.props.match.params.id,this.props.match.params.photoID).on('value', snapshot => {
      const capturedObject = snapshot.val();
      console.log("capturedObject");
      console.log(capturedObject);

      var photoSet = [];
      for (var i = 0; i < capturedObject.photoReferences.length; i++){
        var toAdd = {"id": i, "name": "name", "image": capturedObject.photoReferences[i]}
        photoSet.push(toAdd)
      }

      this.setState({
        photos: photoSet,
        date: capturedObject.date,
        photoType: capturedObject.photoSetType,
        startDate: new Date(),
        loading: false,
        modalShow: false, 
        setModalShow: false
      });

      console.log("state:", this.state.photos)
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div className="mainBody">
        <div className="header">
          <h1>Patients/{this.props.match.params.id}/{this.props.match.params.photoID}</h1>

        </div>

		{!!this.state.photos && <PDFDownloadLink
        document={<PhotosPDF photosList={this.state.photos} testProp="Hello"/>}
        fileName="movielist.pdf"
        style={{
          textDecoration: "none",
          padding: "10px",
          color: "#4a4a4a",
          backgroundColor: "#f2f2f2",
          border: "1px solid #4a4a4a"
        }}
      > Download this PDF YO</PDFDownloadLink>}


        <p>Hello, I'm actually making a difference in the world. I am</p>        

        {!!this.state.photos && <Tiles data={this.state.photos} />}


        {loading && <div>Loading ...</div>}



      </div>
    );
  }
}
 
export default withFirebase(IndividualPhotos);