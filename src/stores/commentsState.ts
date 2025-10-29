import { type UploadUserFile } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommonData } from '@/components/mComment/types'

export interface CommentsState {
  comments: CommonData[]
  total: number
  currentPage: number
  pageSize: number
  showMainReplyForm: boolean
  replyForm: { replyContent: string }
  fileList: UploadUserFile[]
  isStarred: boolean
  disabledAction: boolean
  mainReplyFormRef: any
  postUserId: string
  selectedUserId: string
  subjectName: 'issue' | 'post'
  postYear: string
  postIssue: string
  issueId: string
  postId: string
}

export interface IState {
  comments: CommonData[]
  total: number
  currentPage: number
  pageSize: number
  showMainReplyForm: boolean
  replyForm: { replyContent: string }
  fileList: UploadUserFile[]
  isStarred: boolean
  disabledAction: boolean
  mainReplyFormRef: any
  postUserId: string
  selectedUserId: string
  subjectName: 'issue' | 'post'
  postYear: string
  postIssue: string
  issueId: string
  postId: string
}

export interface IAction {}

export const useCommentsState = defineStore<'state', IState, any, IAction>('state', () => {
  const commentsState = ref<CommentsState>({
    comments: [],
    total: 0,
    currentPage: 1,
    pageSize: 15,
    showMainReplyForm: false,
    replyForm: { replyContent: '' },
    fileList: [],
    isStarred: false,
    disabledAction: true,
    mainReplyFormRef: null,
    postUserId: '',
    selectedUserId: '',
    subjectName: 'post',
    postYear: '',
    postIssue: '',
    issueId: '',
    postId: ''
  })

  return { commentsState }
})
const { commentsState } = useCommentsState()
export const resetCommentsState = (subject?: { subjectName: 'issue' | 'post' }) => {
  commentsState.comments = []
  commentsState.total = 0
  commentsState.currentPage = 1
  commentsState.pageSize = 15
  commentsState.showMainReplyForm = false
  commentsState.replyForm.replyContent = ''
  commentsState.isStarred = false
  commentsState.mainReplyFormRef = null
  commentsState.postUserId = ''
  commentsState.selectedUserId = ''

  if (subject) {
    commentsState.subjectName = subject.subjectName
    if (subject.subjectName === 'issue') {
      commentsState.postYear = ''
      commentsState.postIssue = ''
    }
  }
}

// Add more state manipulation functions as needed
