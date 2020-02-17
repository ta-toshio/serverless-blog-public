import Link from 'next/link'

const Tag = ({ label }) => (
  <div className="tag-outer">
    <Link
      href='/tag/[id]'
      as={`/tag/${encodeURIComponent(label)}`}
    >
      <a>
        <div className="tag">
          <span className="tag-label">#{label}</span>
        </div>
      </a>
    </Link>
    <style jsx>{`
      .tag-outer {
        display: inline-block;
        margin-right: 5px;
        margin-bottom: 5px;
        letter-spacing: normal;
        vertical-align: middle;
      }
      .tag {
        padding: 2px 8px;
        border: 1px solid #e6e6e6;
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
      }
      .tag:hover {
        border: 1px solid #a8abb1;
        transition: border .2s cubic-bezier(1,0,0,1);
      }
      .tag-label {
        font-size: 12px;
        overflow: hidden;
        line-height: 1.5;
        color: #222;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `}</style>
  </div>
)

export default Tag