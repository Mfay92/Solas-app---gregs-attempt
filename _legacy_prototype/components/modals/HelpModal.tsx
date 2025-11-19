import React from 'react';
import Modal from '../Modal';
import { HELP_CONTENT } from '../../services/helpContent';

export type HelpTopic = 'peopleDatabase' | 'notesAndUpdates' | 'propertyDatabase';

type HelpModalProps = {
    topic: HelpTopic;
    onClose: () => void;
};

const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {
    const helpData = HELP_CONTENT[topic];

    if (!helpData) {
        return (
             <Modal title="Help Not Found" onClose={onClose}>
                <p>Sorry, help content for this topic has not been created yet.</p>
            </Modal>
        );
    }

    return (
        <Modal title={helpData.title} onClose={onClose} className="z-[70]">
            {helpData.content}
        </Modal>
    );
};

export default HelpModal;
