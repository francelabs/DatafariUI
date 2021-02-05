import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import FeedbackDocumentNotFoundModal from '../../Pages/FeedbackDocumentNotFoundModal/FeedbackDocumentNotFoundModal';
import FeedbackSuggestionModal from '../../Pages/FeedbackSuggestionModal/FeedbackSuggestionModal';
import FeedbackBugReportModal from '../../Pages/FeedbackBugReportModal/FeedbackBugReportModal';
import FeedbackCommentModal from '../../Pages/FeedbackCommentModal/FeedbackCommentModal';

const FeedbacksMenu = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null);

  return (
    <>
      <Menu
        id={props.id}
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.onClose}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            props.onClose();
            setOpen('document');
          }}
        >
          {t("I don't find a document")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onClose();
            setOpen('bug');
          }}
        >
          {t('I found a bug')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onClose();
            setOpen('suggestion');
          }}
        >
          {t('I have suggestions')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onClose();
            setOpen('comment');
          }}
        >
          {t('I have comments')}
        </MenuItem>
      </Menu>
      <FeedbackDocumentNotFoundModal
        open={open === 'document'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <FeedbackSuggestionModal
        open={open === 'suggestion'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <FeedbackBugReportModal
        open={open === 'bug'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <FeedbackCommentModal
        open={open === 'comment'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </>
  );
};

export default FeedbacksMenu;
