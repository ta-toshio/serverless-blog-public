import React, { useState, useEffect, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import EditorjsPresenterRender from '../../components/editorjs/PresenterRender'
import { getStatus, deleteStatus } from '../../domains/models/status'
import AuthContext from '../../components/contexts/auth'

const useStatuses = ({ defaultStatuses, refresh }) => {
  const [ statuses, setStatuses ] = useState(defaultStatuses)
  const [ hasMoreStatus, setHasMoreStatus ] = useState(false)

  const fetchMoreStatus = async e => {
    const status = statuses[statuses.length - 1]
    if (!status) {
      return
    }
    const _statuses = await getStatus({
      createdAt: status.createdAt,
    })
    if (_statuses.length > 0) {
      setStatuses([...statuses, ..._statuses])
      setHasMoreStatus(true)
    }
  }

  useEffect(() => {
    const fetchStatus = async() => {
      const _statuses = await getStatus()
      setStatuses([ ..._statuses ])
      setHasMoreStatus(true)
    }

    refresh && fetchStatus()
  }, [ refresh ])

  useEffect(() => {
    setStatuses(defaultStatuses)
    setHasMoreStatus(true)
  }, [ defaultStatuses ])

  return {
    statuses,
    setStatuses,
    fetchMoreStatus,
    hasMoreStatus,
  }
}

const List = ({
  defaultStatuses = [],
  refresh,
  handleRefresh
}) => {
  const { statuses, fetchMoreStatus, hasMoreStatus } = useStatuses({ defaultStatuses, refresh })
  const { user } = useContext(AuthContext)

  return (
    <InfiniteScroll
      dataLength={statuses.length}
      next={fetchMoreStatus}
      hasMore={hasMoreStatus}
      scrollThreshold={0.95}
      className="is-space"
      style={{ overflow: 'initial' }}
    >
      {statuses && statuses.map(status => (
        <div className="list-status heading" key={status.id}>
          <EditorjsPresenterRender blocks={status.body} />
          {user && (
            <button
              className="btn action"
              onClick={e => {
                deleteStatus(status.id)
                handleRefresh()
              }}
            >
              Delete
            </button>
          )}
          <style jsx>{`
            .list-status {
              position: relative;
            }
            .action {
              position: absolute;
              right: -100px;
              top: 0;
            }
          `}</style>
        </div>
      ))}
    </InfiniteScroll>
  )
}

List.getInitialProps = async ({ req, res, query }) => {
  const defaultStatuses = await getStatus()
  return { defaultStatuses }
}

export default List