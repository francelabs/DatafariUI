import React, { useEffect, useReducer, useState } from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import PreviewTopBar from '../../Components/Preview/PreviewTopBar/PreviewTopBar';
import PreviewLeftMenu from '../../Components/Preview/PreviewLeftMenu/PreviewLeftMenu';
import PreviewNavigation from '../../Components/Preview/PreviewNavigation/PreviewNavigation';
import PreviewContent from '../../Components/Preview/PreviewContent/PreviewContent';
import PreviewRightMenu from '../../Components/Preview/PreviewRightMenu/PreviewRightMenu';
import useHttp from '../../Hooks/useHttp';

import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    flexGrow: 1,
  },

  columnsMenu: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    paddingTop: 0,
  },

  centerColumn: {
    marginTop: theme.spacing(2),
  },

  facetDivider: {
    '&:last-of-type': {
      display: 'none',
    },
  },
}));

// the '%' is the remainder operator and can return negative results, thus this mod function.
const mod = (k, n) => ((k % n) + n) % n;

const highlightingReducer = (currentHighlighting, action) => {
  const newHighlighting = { ...currentHighlighting };
  const term = { ...newHighlighting[action.term] };
  newHighlighting[action.term] = term;
  switch (action.type) {
    case 'INIT':
      return { ...action.highlighting };
    case 'TOGGLE_HIGHLIGHT':
      term.highlighted = !term.highlighted;
      term.highlightedIndex = undefined;
      return newHighlighting;
    case 'HIGHLIGHT_NEXT':
      term.highlightedIndex =
        term.highlightedIndex !== undefined
          ? mod(term.highlightedIndex + 1, term.numOccurence)
          : 0;
      newHighlighting[action.term] = term;
      return newHighlighting;
    case 'HIGHLIGHT_PREVIOUS':
      term.highlightedIndex =
        term.highlightedIndex !== undefined
          ? mod(term.highlightedIndex - 1, term.numOccurence)
          : term.numOccurence - 1;
      newHighlighting[action.term] = term;
      return newHighlighting;
    default:
      return currentHighlighting;
  }
};

const Preview = (props) => {
  const baseURL = '/Datafari/SearchAggregator';
  const classes = useStyles();
  const { isLoading, error, data, sendRequest } = useHttp();
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const urlParams = new URLSearchParams(location.search);
  const [highlighting, dispatchHighlighting] = useReducer(
    highlightingReducer,
    {}
  );
  const [textSplit, setTextSplit] = useState([]);

  useEffect(() => {
    // Prepare and send the request to get the document data
    const queryParams = new URLSearchParams(location.search);
    const docPos = queryParams.get('docPos');
    const docId = queryParams.get('docId');
    queryParams.delete('docPos');
    queryParams.delete('docId');
    queryParams.delete('fl');
    if (docId) {
      // Build the URL path (same whatever the situation)
      const url = new URL(`${baseURL}/select`, window.location.href);
      if (docPos !== undefined && docPos !== null) {
        // Opened from a search page: set proper URL params
        queryParams.set('rows', 3);
        queryParams.set('start', docPos - 1);
        if (docPos === 0) {
          queryParams.set('rows', 2);
          queryParams.set('start', 0);
        }
        queryParams.set('wt', 'json');
        queryParams.set('action', 'OPEN_PREVIEW');

        url.search = `?${queryParams.toString()}`;
      } else {
        // Opened from a shared link: set proper URL params
        const params = new URLSearchParams();
        params.set('q', `id:("${encodeURI(docId)}")`);
        params.set('wt', 'json');
        params.set('action', 'OPEN_PREVIEW_SHARED');
        url.search = `?${params.toString()}`;
      }
      sendRequest(url);
    } else {
      // Cannot do anything without a docId, go back to the search page or show an error ?
    }
  }, [location, sendRequest]);

  useEffect(() => {
    // Treat the response with the document data and possible errors
    if (!isLoading && !error && data) {
      // Get data and work with it
      if (data.response && data.response.docs && data.highlighting) {
        const initDocuments = data.response.docs.map((document) => {
          document.highlighting = data.highlighting[document.id];
          return document;
        });
        setDocuments(initDocuments);
        const queryParams = new URLSearchParams(location.search);
        const docPos = queryParams.get('docPos');
        let currentDoc = initDocuments[0];
        if (currentDoc > 0) {
          currentDoc = initDocuments[1];
        }
        // const currentDoc = initDocuments.reduce((accu, doc) => {
        //   if (accu != null) {
        //     return accu;
        //   } else if (
        //     decodeURIComponent(doc.id) ===
        //     decodeURIComponent(queryParams.get('docId'))
        //   ) {
        //     return doc;
        //   }
        //   return null;
        // }, null);
        const termCollection = extractTermsFromHighlighting(currentDoc);
        const [initHighlighting, initTextSplit] = prepareTextSplit(
          currentDoc,
          termCollection
        );
        termCollection.forEach((term) => {
          initHighlighting[term] = {
            ...initHighlighting[term],
            highlighted: false,
            highlightedIndex: undefined,
          };
        });
        setTextSplit(initTextSplit);
        dispatchHighlighting({ type: 'INIT', highlighting: initHighlighting });
      }
    } else if (!isLoading && error) {
      // Error handling
    }
  }, [data, error, isLoading, location.search]);

  // Builds the collection of terms highlighted by the solr highlighter
  // We sort them by increasing length, this helps during splitting strings
  // when one is contained in another one (i.e enron's and enron).
  const extractTermsFromHighlighting = (document) => {
    // Retrieve the document highlighting if any
    const fileHighlighting = document.highlighting;
    const termsCollection = [];
    // Fill the termsCollection with the terms found in the query highlighting
    for (const highlightField in fileHighlighting) {
      if (
        highlightField.indexOf('content') !== -1 ||
        highlightField === 'exactContent'
      ) {
        if (fileHighlighting[highlightField].length > 0) {
          const contentHighlight = fileHighlighting[highlightField][0];
          const termRegex = /<span class="em">(.*?)<\/span>*/gm;
          let match = termRegex.exec(contentHighlight);
          while (match != null) {
            var foundTerm = match[1].trim().toLowerCase();
            if (termsCollection.indexOf(foundTerm) === -1) {
              termsCollection.push(foundTerm);
            }
            match = termRegex.exec(contentHighlight);
          }
        }
      }
    }
    termsCollection.sort((a, b) => {
      return a.length - b.length;
    });
    return termsCollection;
  };

  // Extract the exact content from the document and splits it
  // on each term of the term collection. Returns an highlighting object
  // with the terms as keys and an object with the key numOccurences filled.
  // Also returns an array representing the text splitted at each term:
  // ["A brown ", "fox", "running after a little ", "bunny", "."] if the terms
  // were fox and bunny.
  const prepareTextSplit = (document, termCollection) => {
    const initHighlighting = {};
    let initTextSplit = [];
    let docContent = undefined;
    for (let i = 0; i < document.exactContent.length; i++) {
      if (
        document.exactContent[i] !== undefined &&
        document.exactContent[i] != null &&
        document.exactContent[i].trim() !== ''
      ) {
        docContent = document.exactContent[i];
      }
    }
    initTextSplit = [docContent];
    termCollection.forEach((term) => {
      // Brackets in the regexp allow to keep the matched string in the split procedure
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      let numOccurence = 0;
      let newSplit = [];
      initTextSplit.forEach((textpart) => {
        const tempSplit = textpart.split(regex);
        numOccurence += (tempSplit.length - 1) / 2;
        newSplit = newSplit.concat(tempSplit);
      });
      initHighlighting[term] = { numOccurence: numOccurence };
      initTextSplit = newSplit;
    });

    return [initHighlighting, initTextSplit];
  };

  let nextDocument = null;
  let previousDocument = null;
  let document = null;
  if (documents && documents.length > 1) {
    const docPos = urlParams.get('docPos');
    if (docPos === 0) {
      document = documents[0];
      nextDocument = documents[1];
    } else {
      previousDocument = documents[0];
      document = documents[1];
      if (documents.length === 3) {
        nextDocument = documents[2];
      }
    }
  }

  return (
    <>
      <PreviewTopBar isLoading={isLoading} error={error} document={document} />
      <Grid container className={classes.root}>
        <Grid item lg={3}>
          <div className={classes.columnsMenu}>
            <PreviewLeftMenu document={document} />
          </div>
        </Grid>
        <Grid item lg={6}>
          <PreviewNavigation
            isLoading={isLoading}
            error={error}
            document={document}
            nextDocument={nextDocument}
            previousDocument={previousDocument}
          />
          <PreviewContent textSplit={textSplit} highlighting={highlighting} />
        </Grid>
        <Grid item lg={3}>
          <div className={classes.columnsMenu}>
            <PreviewRightMenu
              document={document}
              highlighting={highlighting}
              dispatchHighlighting={dispatchHighlighting}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Preview;
