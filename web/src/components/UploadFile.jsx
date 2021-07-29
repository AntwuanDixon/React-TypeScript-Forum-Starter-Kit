import React from 'react'
import Dropzone from "react-dropzone";
import axios from "axios";
import moment from "moment";
// import { compose, gql, graphql } from "react-apollo";
import { gql, compose, graphql } from 'urql'
import {useS3SignMutation} from "../generated/graphql"


class Upload extends React.Component {
    state = {
      name: "test",
      file: null
    };
  
    // onDrop = async files => {
    //   console.log('files', files[0])
    //   this.setState({ file: files[0] });
    // };
  
    onChange = e => {
      console.log(e.target.files)
      this.setState({file: e.target.files[0]});
    };
  
    uploadToS3 = async (file, signedRequest) => {
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };
      await axios.put(signedRequest, file, options);
    };
  
    formatFilename = filename => {
      const date = moment().format("YYYYMMDD");
      const randomString = Math.random()
        .toString(36)
        .substring(2, 7);
      const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const newFilename = `audio/${date}-${randomString}-${cleanFileName}`;
      return newFilename.substring(0, 60);
    };
  
    submit = async () => {
      console.log('state', this.state)
      const { file } = this.state;
      const response = await useS3SignMutation({
        variables: {
          filename: this.formatFilename(file.name),
          filetype: file.type
        }
      });
      console.log('response from s3 sign', response)
      const { signedRequest, url } = response.data.signS3;
      console.log('signedrequest:::', signedRequest)
      await this.uploadToS3(file, signedRequest);
      console.log(url)
      // const graphqlResponse = await this.props.createChampion({
      //   variables: {
      //     name,
      //     audioUrl: url
      //   }
      // });
  
      // this.props.history.push(
      //   `/champion/${graphqlResponse.data.createChampion.id}`
      // );
    };
  
    render() {
      return (
        <div>
          <input name="name" onChange={this.onChange} value={this.state.name} />
          <input onChange={(e) => this.onChange(e)} type="file" accept="image/*"></input>
          <button onClick={this.submit}>Submit</button>
        </div>
      );
    }
  }
  
  // const CreateChampionMutation = gql`
  //   mutation($name: String!, $audioUrl: String!) {
  //     createChampion(name: $name, audioUrl: $pictureUrl) {
  //       id
  //     }
  //   }
  // `;
  
  // const s3SignMutation = gql`
  //   mutation($filename: String!, $filetype: String!) {
  //     signS3(filename: $filename, filetype: $filetype) {
  //       url
  //       signedRequest
  //     }
  //   }
  // `;
  
  // export default compose(
  //   // graphql(CreateChampionMutation, { name: "createChampion" }),
  //   // graphql(s3SignMutation, { name: "s3Sign" })
  // )(Upload);
  export default Upload
