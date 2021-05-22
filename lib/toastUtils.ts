import {
  NOTIFICATION_TOAST as NOTIFICATION_TOAST_ORIG,
} from 'shared/src/services/notification-service';

import {
  ToastService,
  IToastOptions,
} from 'components/Toast';

import { NavigationService } from 'navigation';
import { ROUTE } from 'lib/constants';

import unlockImg from 'assets/images/unlock.png';
import caretRightImg from 'assets/images/caret-right.png';
import bookImg from 'assets/images/book.png';
import audioImg from 'assets/images/audio.png';
import usersImg from 'assets/images/users.png';

const toastUtils = {
  show(title: string, message: string, options?: IToastOptions) {
    ToastService.show(title, message, options);
  },
  showNotification(type: string) {
    let res: {
      title: string,
      message: string,
      options: IToastOptions,
    } | undefined;

    switch(type) {
      case NOTIFICATION_TOAST.BOOK_UNBLOCKED:
        res = {
          title: 'Book unblocked',
          message: '“%BookTitle%” by %AuthorName%',
          options: {
            titleIcon: unlockImg,
            onTapCallback: () => {
              NavigationService.navigate(ROUTE.BOOK, {
                bookId: '6037ea508840060008580a03',
              })
            }
          },
        };

        break;
      case NOTIFICATION_TOAST.CONTENT_ADDED:
        res = {
          title: 'Content Added',
          message: 'Author interview of %AuthorName%',
          options: {
            titleIcon: caretRightImg,
            // onTapCallback: () => {
            //   NavigationService.navigate();
            // }
          },
        };

        break;
      case NOTIFICATION_TOAST.BOOK_SELECTED:
        res = {
          title: 'Book selected',
          message: '%ClubName%: “%BookTitle%”',
          options: {
            titleIcon: bookImg,
          },
        };

        break;
      case NOTIFICATION_TOAST.NEW_PROMPT_ADDED:
        res = {
          title: 'New prompt added',
          message: '“%BookTitle%”: %PromptName%',
          options: {
            titleIcon: caretRightImg,
          },
        };

        break;
      case NOTIFICATION_TOAST.HAPPENING_NOW:
        res = {
          title: 'Happening now',
          message: '%ConvoTopic%',
          options: {
            titleIcon: audioImg,
          },
        };

        break;
      case NOTIFICATION_TOAST.SPEAKER_INVITE:
        res = {
          title: 'Speaker Invite',
          message: 'Join %First_Last% in %ConvoTopic%',
          options: {
            titleIcon: audioImg,
          },
        };

        break;
      case NOTIFICATION_TOAST.LISTENER_INVITE:
        res = {
          title: 'Listener Invite',
          message: 'Join %First_Last% in %ConvoTopic%',
          options: {
            titleIcon: audioImg,
          },
        };

        break;
      case NOTIFICATION_TOAST.INVITE_FRIENDS:
        res = {
          title: 'Invite Friends',
          message: 'You’ve received %Number% invites. ',
          options: {
            titleIcon: usersImg,
          },
        };

        break;
      default:
        break;
    }

    if (!res) {
      return;
    }

    ToastService.show(res.title, res.message, res.options);
  },
};

export const NOTIFICATION_TOAST = NOTIFICATION_TOAST_ORIG;

export default toastUtils;
