import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function CreateNFT() {
  const { marketplaceContract, account } = useWeb3();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preview, setPreview] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!marketplaceContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Create metadata JSON
      const metadata = {
        name,
        description,
        image: imageUrl,
        attributes: [
          { trait_type: "Creator", value: account },
          { trait_type: "Created", value: new Date().toISOString() }
        ]
      };

      // In production, upload to IPFS. For demo, use data URI
      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      const tx = await marketplaceContract.mintNFT(tokenURI);
      setMessage({ type: 'info', text: 'Minting NFT. Please wait...' });
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'NFTMinted');
      const tokenId = event?.args?.tokenId.toString();

      setMessage({ 
        type: 'success', 
        text: `NFT #${tokenId} created successfully!` 
      });

      // Reset form
      setName('');
      setDescription('');
      setImageUrl('');
      setPreview(false);
    } catch (error) {
      console.error('Create NFT error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create NFT' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Create NFT</h1>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' :
          message.type === 'error' ? 'alert-error' : 'alert-info'
        }`}>
          {message.type === 'success' && <span className="text-2xl">✅</span>}
          {message.type === 'error' && <span className="text-2xl">❌</span>}
          {message.type === 'info' && <span className="loading-spinner"></span>}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Form */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">✨</div>
            <div>
              <h2 className="text-xl font-bold">NFT Details</h2>
              <p className="text-sm text-slate-400">Fill in your NFT information</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">NFT Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome NFT"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your NFT..."
                className="input-field min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL *</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="input-field"
                required
              />
              <p className="text-xs text-slate-400 mt-2">
                Use a direct link to your image (IPFS, Imgur, etc.)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="btn btn-secondary w-full"
            >
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  Create NFT
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview & Info */}
        <div className="space-y-6">
          {preview && imageUrl && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="nft-card">
                <img
                  src={imageUrl}
                  alt="NFT Preview"
                  className="nft-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x240?text=Invalid+Image+URL';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{name || 'NFT Name'}</h3>
                  <p className="text-sm text-slate-400">{description || 'Description...'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold mb-3">ℹ️ Information</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong>Minting:</strong> Creates a unique NFT on the blockchain</li>
              <li><strong>Ownership:</strong> You will be the initial owner</li>
              <li><strong>Metadata:</strong> Stored on-chain (demo) or IPFS (production)</li>
              <li><strong>Gas Fees:</strong> Requires ETH for transaction</li>
              <li><strong>Trading:</strong> Can be listed for sale after creation</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Use high-quality images</li>
              <li>✓ Write engaging descriptions</li>
              <li>✓ Consider using IPFS for decentralization</li>
              <li>✓ Double-check all details before minting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNFT;